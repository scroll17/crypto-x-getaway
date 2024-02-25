import { TPaginateRequest } from '../../common';

export enum BlockchainNetworkQueryKeys {
  blockchainNetworkAll = 'blockchainNetworkAll',
  blockchainNetwork = 'blockchainNetwork',
}

export type ActionBlockchainNetworkAllRequestData = TPaginateRequest<object>;

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
type ConnectOptions = {
  keepAlive: boolean;
  withCredentials: boolean;
  timeout: number;
};
type ConnectEntity = {
  url: string;
  connectOptions: ConnectOptions;
};

export interface BlockchainNetworkEntity {
  _id: string;
  innerKey: string;
  family: string;
  name: NetworkName;
  localName: string;
  prototypeLevel: string;
  currencySymbol: string;
  networkId: number;
  scan: string;
  httpConnect: ConnectEntity;
  socketConnect: ConnectEntity;
  description: string;
  available: boolean;
  removedAt: string;
}
