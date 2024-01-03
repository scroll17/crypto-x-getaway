import { TPaginateRequest } from '../common';

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
}

export type ActionBlockchainAccountAllRequestData = TPaginateRequest<IActionAccountFilter>;

enum BlockchainNetworks {
  Ethereum = 'ethereum',
  StarkNet = 'starknet',
}

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

type Comment = {
  _id: string;
  text: string;
  createdBy: UserEntity;
};

type BlockchainNetwork = {
  _id: string;
  name: BlockchainNetworks;
  description: string;
};

export interface ActionBlockchainAccountsAll {
  _id: string;
  name: string;
  labels: string[];
  network: BlockchainNetwork;
  comments: Comment[];
  createdBy: UserEntity;
}

export interface ActionAddBlockchainAccountRequestData {
  name: string;
  address: string;
  labels: string[];
  network: string;
  // temporality unknown
  networkInfo: unknown;
}
