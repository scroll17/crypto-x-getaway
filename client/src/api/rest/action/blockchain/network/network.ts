import { baseApi } from '@api/config';
import { ActionBlockchainNetworkAllRequestData } from '@types/action/blockchain/network';

export const getAllBlockchainNetwork = async (
  requestData: ActionBlockchainNetworkAllRequestData,
) => {
  const response = await baseApi.post('action/blockchain/network/all', requestData);
  return response.data;
};

export const getBlockchainNetwork = async (id: string) => {
  const response = await baseApi.get(`action/blockchain/network/${id}`);
  return response.data;
};
