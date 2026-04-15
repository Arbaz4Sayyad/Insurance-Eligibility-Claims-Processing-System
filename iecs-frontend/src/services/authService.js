import apiClient from '../api/apiClient';

/**
 * Service Layer: Authentication
 * Strictly decouples internal Axois logic from React components to ensure cleanly tested workflows.
 */
const authService = {
  
  /**
   * Authenticate User 
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} Backend API response mapped to DTO.
   */
  login: async (credentials) => {
    // Expected backend response: { success: true, data: { token, role, userId } }
    const response = await apiClient.post('/auth/signin', credentials);
    
    // Automatic Storage
    if (response.success && response.data?.token) {
      localStorage.setItem('iecs-token', response.data.token);
      localStorage.setItem('iecs-role', response.data.role);
      localStorage.setItem('iecs-userId', response.data.userId);
    }
    
    return response;
  },

  /**
   * Register a new user
   * @param {Object} data - { username, password, email, role }
   */
  register: async (data) => {
    return await apiClient.post('/users/register', data);
  },

  /**
   * Securely destroy active session and prune localStorage 
   */
  logout: () => {
    localStorage.removeItem('iecs-token');
    localStorage.removeItem('iecs-role');
    localStorage.removeItem('iecs-userId');
    // Note: React Router will pick this up automatically or we can emit an event here
  },

  /**
   * Validate existing JWT session
   */
  checkSession: async () => {
    return await apiClient.get('/users/me');
  }
};

export default authService;
