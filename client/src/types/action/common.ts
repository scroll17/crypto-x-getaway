export type TPaginateRequest<Filter> = {
  paginate: {
    page: number;
    count: number;
  };
  sort: {
    name: string;
    type: 'asc';
  };
  filter?: Filter;
};

export interface IActionFilter {
  id: string;
  name: string;
}

export type Comment = {
  _id: string;
  text: string;
  createdBy: UserEntity;
};

enum BlockchainNetworks {
  Ethereum = 'ethereum',
  StarkNet = 'starknet',
}

export type BlockchainNetwork = {
  _id: string;
  name: BlockchainNetworks;
  description: string;
};
