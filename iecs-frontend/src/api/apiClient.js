import axios from 'axios';

// Singleton Axios Instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:18080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ✅ Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Attempt to grab token from localStorage
    const token = localStorage.getItem('iecs-token');
    
    // Improved check: Ensure token is present and has proper JWT structure (basic)
    if (token && token.split('.').length === 3) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (token) {
       console.warn(`[API] Malformed token detected (Length: ${token.length}), skipping Authorization header`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🛡️ Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Always return predictable structure exactly mapped to backend ApiResponse<T>
    // Assuming Spring Boot returns: { success: boolean, data: any, message: string }
    return response.data;
  },
  (error) => {
    // Ensure error structure remains consistent for UI parsing
    let normalizedError = {
      success: false,
      message: 'An unexpected error occurred.',
      code: 'UNKNOWN_ERROR'
    };

    if (error.response) {
      // Backend returned a status code outside 2xx range
      const { status, data } = error.response;
      
      if (status === 401) {
        // Handle Session Expiration
        localStorage.removeItem('iecs-token');
        localStorage.removeItem('iecs-role');
        // Dispatch custom event to trigger React Router redirect centrally
        window.dispatchEvent(new Event('iecs-session-expired'));
        normalizedError.message = 'Session expired. Please log in again.';
        normalizedError.code = 'UNAUTHORIZED';
      } else if (status === 403) {
        normalizedError.message = 'Access Denied. You lack permissions for this action.';
        normalizedError.code = 'FORBIDDEN';
      } else if (data && data.message) {
        // Spring Boot ApiError structure
        normalizedError.message = data.message;
        normalizedError.code = data.error?.code || 'API_ERROR';
      } else {
        normalizedError.message = `Server Error: ${status}`;
      }
    } else if (error.request) {
      // Complete Network Failure
      normalizedError.message = 'Network Error. Could not process request.';
      normalizedError.code = 'NETWORK_ERROR';
    }

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
