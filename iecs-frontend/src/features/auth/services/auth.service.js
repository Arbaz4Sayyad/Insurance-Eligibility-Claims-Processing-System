import api from '../../../api/apiClient';

export const authService = {
  login: async (email, password) => {
    // Local Simulation Fallback for Caseworkers
    const localStaff = JSON.parse(localStorage.getItem('iecs_staff') || '[]');
    const worker = localStaff.find(w => w.email === email && w.password === password);
    
    if (worker) {
      return {
        token: `mock-jwt-worker-${worker.id}`,
        role: 'CASEWORKER',
        user: {
          id: worker.id,
          email: worker.email,
          name: worker.name
        }
      };
    }

    try {
      // Backend expects { username, password }
      const response = await api.post('/auth/signin', { username: email, password });
      
      if (response && (response.success || response.token)) {
        const authData = response.data || response;
        localStorage.setItem('iecs-token', authData.token);
        localStorage.setItem('iecs-role', authData.role);
        return {
          token: authData.token,
          role: authData.role,
          user: {
            id: authData.userId || authData.id,
            email: email,
            name: email.split('@')[0]
          }
        };
      }
      throw new Error(response?.message || 'Login failed');
    } catch (error) {
      // Second fallback for demo purposes if API fails but it's a known demo account
      if (password === 'password') {
        if (email === 'admin@iecs.com') return { token: 'mock-jwt-admin', role: 'ADMIN', user: { id: 1, email, name: 'Admin' } };
        if (email === 'caseworker@iecs.com') return { token: 'mock-jwt-worker', role: 'CASEWORKER', user: { id: 2, email, name: 'Worker' } };
        if (email === 'citizen@iecs.com') return { token: 'mock-jwt-citizen', role: 'CITIZEN', user: { id: 3, email, name: 'Citizen' } };
      }

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  register: async (userData) => {
    try {
      // Backend expects { username, email, password, role }
      const payload = {
        username: userData.email, // Using email as username for consistency with login
        email: userData.email,
        password: userData.password,
        role: ['user'] // Default role for public signup
      };
      
      const response = await api.post('/auth/signup', payload);
      
      if (response && response.success) {
        return response;
      }
      throw new Error(response?.message || 'Registration failed');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      // Fallback for mock/non-existent endpoint
      return new Promise((resolve) => {
        setTimeout(() => resolve({ message: 'Reset email sent' }), 1000);
      });
    }
  }
};
