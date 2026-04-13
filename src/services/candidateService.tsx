import { apiRequest } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';

const candidateService = () => {
  const getCandidates = async (params?: any) => {
    try {
      const response = await apiRequest.get(API_ENDPOINTS.CANDIDATES.LIST, {
        params: params,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching activityLogs:', error);
      throw error;
    }
  };
  const createCandidates = async (payload?: any) => {
    try {
      const response = await apiRequest.post(
        API_ENDPOINTS.CANDIDATES.CREATE,
        payload
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching activityLogs:', error);
      throw error;
    }
  };

  return {
    getCandidates,
    createCandidates,
  };
};

export default candidateService;
