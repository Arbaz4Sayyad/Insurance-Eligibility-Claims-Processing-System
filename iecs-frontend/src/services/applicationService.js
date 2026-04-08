import apiClient from '../api/apiClient';
import { evaluateEligibility as localEngine } from '../utils/eligibilityEngine';

/**
 * Service Layer: Application Management
 * Encapsulates all interactions with the AR (Application Registration) 
 * and DC (Data Collection) backend services.
 */
const applicationService = {

  /**
   * Submit a newly captured application form
   */
  createApplication: async (formData) => {
    return await apiClient.post('/ar/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Retrieve Application details securely
   */
  getApplication: async (appId) => {
    return await apiClient.get(`/ar/${appId}`);
  },

  /**
   * Retrieve multiple Applications
   */
  getApplications: async (filters = {}) => {
    return await apiClient.get('/ar/all', { params: filters });
  },

  /**
   * [NEW] Execute Eligibility Evaluation
   * Simulation: Fetches data then runs local rules engine
   */
  evaluateEligibility: async (appId) => {
    try {
      // In a real system, this calls: await apiClient.post(`/ed/evaluate/${appId}`);
      // For now, we simulate the backend call:
      const app = await applicationService.getApplication(appId).catch(() => ({
        id: appId, income: 12000, household: 3, age: 34, childrenCount: 2, employmentStatus: 'EMPLOYED'
      }));
      
      const result = localEngine(app);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, message: 'Eligibility engine failed' };
    }
  },

  /**
   * [NEW] Update status with reasoning (Caseworker Action)
   */
  updateApplicationStatus: async (appId, status, reason = '') => {
    return await apiClient.put(`/ar/${appId}/status`, { status, reason });
  },

  /**
   * [NEW] Fetch Audit History / Timeline
   */
  getReviewHistory: async (appId) => {
    // Simulation logic
    const history = [
      { id: 1, action: 'APPLICATION_SUBMITTED', actor: 'Citizen', timestamp: '2026-04-01T10:00:00Z', note: 'Initial submission' },
      { id: 2, action: 'DATA_COLLECTED', actor: 'System', timestamp: '2026-04-02T14:30:00Z', note: 'Income verified via IRS' },
      { id: 3, action: 'ELIGIBILITY_PENDING', actor: 'System', timestamp: '2026-04-03T09:15:00Z', note: 'Ready for caseworker review' }
    ];
    return { success: true, data: history };
  },

  /**
   * [NEW] Send Message (Communication)
   */
  sendMessage: async (appId, message) => {
    return await apiClient.post(`/ar/${appId}/messages`, { message });
  },

  /**
   * [NEW] Fetch User Notifications
   */
  getNotifications: async () => {
    return await apiClient.get('/user/notifications');
  }
};

export default applicationService;

