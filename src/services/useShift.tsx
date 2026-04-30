import { apiRequest } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';

const useShift = () => {
  const getShifts = async (params?: any) => {
    try {
      const response = await apiRequest.get(API_ENDPOINTS.HR_SETTINGS.SHIFTS, {
        params: params,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching activityLogs:', error);
      throw error;
    }
  };

  return {
    getShifts,
  };
};

export default useShift;
