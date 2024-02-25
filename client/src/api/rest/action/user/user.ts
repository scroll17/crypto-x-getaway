import { ActionUserRequestData } from '../../../../types/action';
import { baseApi } from '../../../config';

export const users = async (requestData: ActionUserRequestData) => {
  const response = await baseApi.post('action/user/all', requestData);
  return response.data;
};
