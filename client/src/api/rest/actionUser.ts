import { baseApi } from '../config';

export const users = async requestData => {
  const response = await baseApi.post('action/user/all', requestData);
  return response.data;
};
