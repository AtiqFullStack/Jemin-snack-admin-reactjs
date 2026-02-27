import React from 'react';
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
  return { getConfig };
};

export default configService;
