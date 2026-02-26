import { apiRequest } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';

const taskService = () => {
  const getTasksList = async () => {
    try {
      const response = await apiRequest.get(API_ENDPOINTS.TASK.LIST);
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching activityLogs:', error);
      throw error;
    }
  };

  const createTask = async (payload: any) => {
    try {
      const response = await apiRequest.post(
        API_ENDPOINTS.TASK.CREATE,
        payload
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error creating Task:', error);
      throw error;
    }
  };

  const getByLeadId = async (id: any) => {
    try {
      const response = await apiRequest.get(
        API_ENDPOINTS.TASK.GET_BY_LEAD_ID(id)
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching activityLogs:', error);
      throw error;
    }
  };

  const getById = async (id: any) => {
    try {
      const response = await apiRequest.get(API_ENDPOINTS.TASK.GET_BY_ID(id));
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching activityLogs:', error);
      throw error;
    }
  };

  return {
    getTasksList,
    getByLeadId,
    createTask,
    getById,
  };
};

export default taskService;
