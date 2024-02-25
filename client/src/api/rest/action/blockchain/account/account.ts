import { baseApi } from '@api/config';
import {
  ActionBlockchainAccountAllRequestData,
  ActionAddBlockchainAccountRequestData,
  BlockchainAccountEntity,
} from '@types/action/blockchain/account';


export const getAllBlockchainAccount = async (
  requestData: ActionBlockchainAccountAllRequestData,
) => {
  const response = await baseApi.post<{ data: BlockchainAccountEntity[] }>('action/blockchain/account/all', requestData);
  return response.data;
};

export const getBlockchainAccount = async (id: string) => {
  const response = await baseApi.get(`action/blockchain/account/${id}`);
  return response.data;
};

export const getBlockchainAccountLabels = async () => {
  const response = await baseApi.get('action/blockchain/account/labels');
  return response.data;
};

export const addBlockchainAccount = async (requestData: ActionAddBlockchainAccountRequestData) => {
  const response = await baseApi.post('action/blockchain/account/add', requestData);
  return response.data;
};
