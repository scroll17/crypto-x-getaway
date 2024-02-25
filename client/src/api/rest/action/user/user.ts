import { baseApi } from '@api/config';
import { ActionUserRequestData } from '@types/action';

export const users = async (requestData: ActionUserRequestData) => {
  const response = await baseApi.post('action/user/all', requestData);
  return response.data;
};
