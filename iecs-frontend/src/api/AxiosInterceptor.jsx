import React, { useEffect } from 'react';
import api from './apiClient';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const AxiosInterceptor = ({ children }) => {
  const { showNotification } = useNotification();
  const { logout } = useAuth();

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        // Success notifications for specific methods (POST/PUT/DELETE)
        if (['post', 'put', 'delete'].includes(response.config.method)) {
          // You could show a generic success message here or handle it in the service
          // showNotification('Action completed successfully', 'success');
        }
        return response;
      },
      (error) => {
        const message = error.response?.data?.message || 'A network error occurred. Please try again.';
        
        if (error.response?.status === 401) {
          showNotification('Session expired. Please login again.', 'error');
          logout();
        } else if (error.response?.status === 403) {
          showNotification('You do not have permission to perform this action.', 'error');
        } else if (error.response?.status >= 500) {
          showNotification('Server error. Our engineers are notified.', 'error');
        } else if (error.code === 'ECONNABORTED') {
          showNotification('Request timed out.', 'warning');
        } else {
          showNotification(message, 'error');
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [showNotification, logout]);

  return children;
};

export default AxiosInterceptor;
