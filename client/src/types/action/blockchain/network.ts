import { TPaginateRequest, IActionFilter } from '../common';

export enum BlockchainNetworkQueryKeys {
  blockchainNetworkAll = 'blockchainNetworkAll',
}

export type ActionBlockchainNetworkAllRequestData = TPaginateRequest<IActionFilter>;

enum NetworkName {
  ethereum = 'ethereum',
  zkSync = 'zkSync',
}

export interface ActionBlockchainNetworkAll {
  _id: string;
  name: NetworkName;
  localName: string;
  family: string;
  currencySymbol: string;
  level: string;
  prototypeLevel: string;
  networkId: number;
  available: boolean;
}
