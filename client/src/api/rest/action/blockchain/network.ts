import { baseApi } from '../../../config';

export const getAllBlockchainNetwork = async (requestData: unknown) => {
  const response = await baseApi.post('action/blockchain/network/all', requestData);
  return response.data;
};
