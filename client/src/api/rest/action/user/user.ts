import { ActionUserRequestData } from '../../../types/action';
import { baseApi } from '../../config';

// TODO: add types
export const users = async (requestData: ActionUserRequestData) => {
  const response = await baseApi.post('action/user/all', requestData);
  return response.data;
};
