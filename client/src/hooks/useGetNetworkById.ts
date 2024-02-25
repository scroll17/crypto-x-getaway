import { useQuery } from 'react-query';

import { getBlockchainNetwork } from '@api-r/action/blockchain/network';
import { BlockchainNetworkQueryKeys } from '@types/action/blockchain/network';

export const useGetNetworkById = (id: string) => {
  const { data, isLoading, isError } = useQuery(
    [BlockchainNetworkQueryKeys.blockchainNetwork, id],
    () => getBlockchainNetwork(id),
    { enabled: !!id },
  );

  return {
    data,
    isLoading,
    isError,
  };
};
