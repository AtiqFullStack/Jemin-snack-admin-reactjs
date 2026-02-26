import { apiRequest } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';

const dashboaradService = () => {
  const getDashboardStats = async () => {
    try {
      const response = await apiRequest.get(API_ENDPOINTS.DASHBOARD.GET_STATS);
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching Dashboard Data', error);
      throw error;
    }
  };
  return { getDashboardStats };
};

export default dashboaradService;
