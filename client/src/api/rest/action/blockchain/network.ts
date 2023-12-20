import { ActionBlockchainNetworkAllRequestData } from '../../../../types/action';
import { baseApi } from '../../../config';

export const getAllBlockchainNetwork = async (
  requestData: ActionBlockchainNetworkAllRequestData,
) => {
  const response = await baseApi.post('action/blockchain/network/all', requestData);
  return response.data;
};
