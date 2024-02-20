import { BlockchainNetwork, TPaginateRequest } from '../common';

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

type UserEntity = {
  _id: string;
  name: string;
  username: string;
  email: string;
  telegramId: number;
  blocked: boolean;
  hasBotAccess: boolean;
  isAdmin: boolean;
  lastActivityAt: Date;
};

export interface BlockchainAccountEntity {
  _id: string;
  name: string;
  labels: string[];
  network?: BlockchainNetwork;
  comments: Comment[];
  createdBy: UserEntity;
  address: string;
}

export interface ActionAddBlockchainAccountRequestData {
  name: string;
  address: string;
  labels: string[];
  network: string;
  // temporality unknown
  networkInfo: unknown;
}
