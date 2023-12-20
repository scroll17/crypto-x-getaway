import { baseApi } from '../../config';

// TODO: add types
export const getBlockchainNetwork = async (requestData: unknown) => {
  const response = await baseApi.post('action/blockchain/network/all', requestData);
  return response.data;
};
