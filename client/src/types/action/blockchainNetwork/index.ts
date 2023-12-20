import { TPaginateRequest, IActionFilter } from '../common';

export enum BlockchainNetworkQueryKeys {
  blockchainNetworkAll = 'blockchainNetworkAll',
}

export type ActionBlockchainNetworkAllRequestData = TPaginateRequest<IActionFilter>;

export interface ActionBlockchainNetworkAll {
  _id: string;
  name: string;
  description: string;
}
