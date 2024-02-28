import React, { FC, useMemo, useState } from 'react';

import { getAllBlockchainAccount } from '@api/rest/action/blockchain/account';
import { useGetAccountById } from '@hooks/useGetAccountById';
import { Button } from '@mui/material';
import {
  BlockchainAccountEntity,
  BlockchainAccountQueryKeys,
} from '@types/action/blockchain/account';
import { generateRandomColorExcludingWhite } from '@utils/getRandomColor';
import { useQuery } from 'react-query';

import { AccountModalContent } from './AccountModalContent';
import { AddAccountForm } from './AddAccountForm';
import { CustomLabel } from '../../CustomLabel';
import { FullScreenLoader } from '../../FullScreenLoader';
import { Column, TableComponent } from '../../TableComponent';

const columns: Column[] = [
  { id: 'id', label: 'id' },
  { id: 'name', label: 'Name' },
  { id: 'network', label: 'Network' },
  { id: 'createdBy', label: 'CreatedBy' },
  { id: 'labels', label: 'Labels', minWidth: 400 },
];

export const AccountsTab: FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: accountData, isLoading: accountDataLoading } = useGetAccountById(accountId);

  const handleModalActions = (state: boolean, id: string = '') => {
    setIsOpenModal(state);
    setAccountId(id);
  };

  const blockchainAccountsData = useQuery(
    BlockchainAccountQueryKeys.blockchainAccountsAll,
    () =>
      getAllBlockchainAccount({
        paginate: { page: 1, count: 10 },
        sort: { name: '_id', type: 'asc' },
      }),
    { select: data => data.data },
  );

  const dataExists = blockchainAccountsData && blockchainAccountsData.data?.length > 0;

  // mb good idea transfer it with button component to hook
  const handleClick = () => {
    blockchainAccountsData.refetch();
  };

  const ROW: Record<Column['id'], string>[] = useMemo(() => {
    if (!dataExists) return [];

    const { data } = blockchainAccountsData;

    return data.map((row: BlockchainAccountEntity) => ({
      id: row._id,
      name: row.name,
      labels: row.labels.map((label, index) => (
        <CustomLabel
          text={label}
          customStyle={{
            backgroundColor: generateRandomColorExcludingWhite(),
            color: 'white',
          }}
          key={index}
        />
      )),
      network: row.network?.name ?? '<undefined>',
      comments: row.comments,
      createdBy: row.createdBy.name,
    }));
  }, [blockchainAccountsData]);

  if (blockchainAccountsData.isFetching) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <Button
          sx={{ mr: 2 }}
          size="large"
          variant="contained"
          color={showForm ? 'success' : 'primary'}
          onClick={() => setShowForm(true)}
        >
          Add
        </Button>
        <Button size="large" variant="contained" onClick={handleClick}>
          Reload
        </Button>
      </div>
      {showForm ? (
        <AddAccountForm onCloseHandler={setShowForm} />
      ) : (
        <TableComponent
          row={ROW}
          columns={columns}
          openModal={isOpenModal}
          onClickRow={handleModalActions}
          dataCheck={dataExists}
          modalChildren={<AccountModalContent data={accountData} />}
          isLoading={accountDataLoading}
        />
      )}
    </>
  );
};
