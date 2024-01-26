import { useQuery } from 'react-query';

import { getBlockchainAccount } from '../api/rest/action/blockchain/account';
import { BlockchainAccountQueryKeys } from '../types/action/blockchain/account';

export const useGetAccountById = (id: string) => {
  const { data, isLoading, isError } = useQuery(
    [BlockchainAccountQueryKeys.blockchainAccount, id],
    () => getBlockchainAccount(id),
    { enabled: !!id },
  );

  return {
    data,
    isLoading,
    isError,
  };
};
