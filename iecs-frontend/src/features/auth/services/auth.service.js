import api from '../../../api/axiosConfig';

export const authService = {
  login: async (email, password) => {
    // In a real app, this would be: 
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;

    // Simulation for now (since we don't have a backend yet)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@iecs.com' && password === 'password') {
          resolve({ token: 'mock-jwt-admin', role: 'ADMIN', user: { name: 'Admin User', email } });
        } else if (email === 'worker@iecs.com' && password === 'password') {
          resolve({ token: 'mock-jwt-worker', role: 'CASEWORKER', user: { name: 'Case Worker', email } });
        } else if (email === 'citizen@iecs.com' && password === 'password') {
          resolve({ token: 'mock-jwt-citizen', role: 'CITIZEN', user: { name: 'Citizen User', email } });
        } else {
          reject({ message: 'Invalid credentials' });
        }
      }, 1000);
    });
  },

  register: async (userData) => {
    // return api.post('/auth/register', userData);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ message: 'Success' }), 1000);
    });
  },

  forgotPassword: async (email) => {
    // return api.post('/auth/forgot-password', { email });
    return new Promise((resolve) => {
      setTimeout(() => resolve({ message: 'Reset email sent' }), 1000);
    });
  }
};
