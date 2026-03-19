import apiClient from './api/apiClient';

const useCallService = () => {
  // const getCalls = async (params?: any) => {
  //     try {
  //         let url = params ? `/config?key=${params}` : `/config`;
  //         const res = await apiClient.get(url);
  //         return res.data;
  //         console.log(res);
  //     } catch (error) {
  //         console.log(error);
  //     }
  // };

  const getCallHistoryApi = async (query: any) => {
    const res = await apiClient.get(`/call/getAll`, {
      params: query,
    });
    return res;
  };
  return { getCallHistoryApi };
};

export default useCallService;
