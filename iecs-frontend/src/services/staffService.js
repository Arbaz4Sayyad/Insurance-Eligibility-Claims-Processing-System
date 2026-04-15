import apiClient from '../api/apiClient';

/**
 * Service Layer: Staff Management
 * Interacts with the User-Service for caseworker onboarding and management.
 */
const staffService = {
  
  /**
   * Fetch all staff/caseworkers from the backend
   */
  getAllStaff: async () => {
    return await apiClient.get('/users?role=CASEWORKER');
  },

  /**
   * Toggle staff active/inactive status
   */
  toggleStatus: async (workerId, currentStatus) => {
    const endpoint = currentStatus === 'ACTIVE' ? 'deactivate' : 'activate';
    return await apiClient.put(`/users/${workerId}/${endpoint}`);
  },

  /**
   * Onboard a new caseworker
   */
  onboardStaff: async (staffData) => {
    // Mapping to backend SignupRequest
    const payload = {
      username: staffData.username || staffData.name.toLowerCase().replace(' ', '_'),
      email: staffData.email,
      password: staffData.password,
      role: ['CASE_WORKER']
    };
    return await apiClient.post('/users/create-caseworker', payload);
  }

};

export default staffService;
