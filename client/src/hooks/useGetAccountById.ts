import { getBlockchainAccount } from '@api-r/action/blockchain/account';
import { BlockchainAccountQueryKeys } from '@types/action/blockchain/account';
import { useQuery } from 'react-query';

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
