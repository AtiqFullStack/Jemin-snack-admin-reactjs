import apiClient from './api/apiClient';

const configService = () => {
  const getConfig = async (params?: any) => {
    try {
      let url = params ? `/config?key=${params}` : `/config`;
      const res = await apiClient.get(url);
      return res.data;
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const createConfig = async (data: any) => {
    try {
      const res = await apiClient.post('/config/create', data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateConfig = async (id: any, data: any) => {
    try {
      const res = await apiClient.put(`/config/update/${id}`, data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      const res = await apiClient.post(`/config/delete/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  return { getConfig, createConfig, updateConfig, deleteConfig };
};

export default configService;
