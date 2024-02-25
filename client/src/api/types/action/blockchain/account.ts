import { BlockchainNetworkEntity } from './network';
import { TPaginateRequest } from '../../common';
import { ActionUserEntity } from '../user';

export interface IActionAccountFilter {
  id: string;
  name: string;
  labels: string[];
  network: string;
  createdBy: string;
}

export enum BlockchainAccountQueryKeys {
  blockchainAccountsAll = 'blockchainAccountAll',
  blockchainAccountLabels = 'blockchainAccountLabels',
  blockchainAccountAdd = 'blockchainAccountAdd',
  blockchainAccount = 'blockchainAccount',
}

export type ActionBlockchainAccountAllRequestData = TPaginateRequest<IActionAccountFilter>;

export interface BlockchainAccountEntity {
  _id: string;
  name: string;
  labels: string[];
  network?: BlockchainNetworkEntity;
  comments: Comment[];
  createdBy: ActionUserEntity;
  address: string;
}

export interface ActionAddBlockchainAccountRequestData {
  name: string;
  address: string;
  labels: string[];
  network: string;
}
