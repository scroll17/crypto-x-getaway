import { ActionBlockchainNetworkAllRequest } from '../../../../types/action';
import { baseApi } from '../../../config';

export const getAllBlockchainNetwork = async (requestData: ActionBlockchainNetworkAllRequest) => {
  const response = await baseApi.post('action/blockchain/network/all', requestData);
  return response.data;
};
