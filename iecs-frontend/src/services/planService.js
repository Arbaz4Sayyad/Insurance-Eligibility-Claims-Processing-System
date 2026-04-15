import apiClient from '../api/apiClient';

/**
 * Service Layer: Benefit Plans
 * Interacts with the AR-Service for plan configuration and persistence.
 */
const planService = {
  
  /**
   * Fetch all benefit plans from the backend
   */
  getAllPlans: async () => {
    return await apiClient.get('/ar/plans');
  },

  /**
   * Create a new benefit plan
   */
  createPlan: async (planData) => {
    return await apiClient.post('/ar/plans', planData);
  },

  /**
   * Update an existing benefit plan
   */
  updatePlan: async (id, planData) => {
    return await apiClient.put(`/ar/plans/${id}`, planData);
  }

};

export default planService;
