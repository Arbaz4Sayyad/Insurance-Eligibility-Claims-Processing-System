import apiClient from '../api/apiClient';

/**
 * Service Layer: Dashboards
 * Specifically targets the Dashboard Aggregator (BFF) service to execute
 * high-performance, single-query data fetches mapped distinctly to operational roles.
 */
const dashboardService = {
  
  /**
   * Fetch aggregated system metrics for the Admin view
   */
  getAdminDashboard: async () => {
    return await apiClient.get('/dashboard/admin');
  },

  /**
   * Fetch intelligent queue priorities and processing SLAs for Caseworkers
   */
  getCaseworkerDashboard: async () => {
    return await apiClient.get('/dashboard/caseworker');
  },

  /**
   * Fetch deeply isolated active application workflows and benefit disbursements per citizen
   */
  getCitizenDashboard: async () => {
    // Note: citizen ID context is managed transparently via the backend JWT token / Request headers.
    return await apiClient.get('/dashboard/citizen');
  }

};

export default dashboardService;
