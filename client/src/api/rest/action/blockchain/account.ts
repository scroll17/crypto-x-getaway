import { ActionBlockchainAccountAllRequestData } from '../../../../types/action/blockchain/account';
import { baseApi } from '../../../config';

export const getAllBlockchainAccount = async (
  requestData: ActionBlockchainAccountAllRequestData,
) => {
  const response = await baseApi.post('action/blockchain/account/all', requestData);
  return response.data;
};
