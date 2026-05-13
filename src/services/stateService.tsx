import { apiRequest } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';

const stateService = () => {
  const getState = async (params?: any) => {
    console.log(params);
    try {
      const url = API_ENDPOINTS.STATE.GET(params);
      console.log(url);
      const response = await apiRequest.get(url);
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  };

  return { getState };
};

export default stateService;
