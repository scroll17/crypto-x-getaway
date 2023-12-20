export enum BlockchainNetworkQueryKeys {
  blockchainNetworkAll = 'blockchainNetworkAll',
}

export interface ActionBlockchainNetworkAllRequest {
  paginate: {
    page: number;
    count: number;
  };
  sort: {
    name: string;
    type: 'asc';
  };
  filter?: {
    id: string;
    name: string;
  };
}

export interface ActionBlockchainNetworkAll {
  _id: string;
  name: string;
  description: string;
}
