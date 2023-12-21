import React, { FC, useMemo, useState } from 'react';

import { Button, TableCell } from '@mui/material';
import { useQuery } from 'react-query';

import { getAllBlockchainAccount } from '../../../api/rest/action/blockchain/account';
import {
  ActionBlockchainAccountsAll,
  BlockchainAccountQueryKeys,
} from '../../../types/action/blockchain/account';
import { generateRandomColorExcludingWhite } from '../../../utils/getRandomColor';
import { FullScreenLoader } from '../../FullScreenLoader';
import { Column, TableComponent } from '../../TableComponent';

const columns: Column[] = [
  { id: 'id', label: 'id' },
  { id: 'name', label: 'Name' },
  { id: 'network', label: 'Network' },
  { id: 'createdBy', label: 'CreatedBy' },
  { id: 'labels', label: 'lLabels', minWidth: 400 },
];

const labelStyle = {
  display: 'inline-block',
  padding: '5px 10px',
  borderRadius: '20px',
  marginLeft: '5px',
};

export const AccountsTab: FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModalActions = (state: boolean, id: string = '') => {
    setIsOpenModal(state);
    console.log(id);
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

    return data.map((row: ActionBlockchainAccountsAll) => ({
      id: row._id,
      name: row.name,
      labels: row.labels.map((label, index) => (
        <TableCell
          sx={{ ...labelStyle, backgroundColor: generateRandomColorExcludingWhite() }}
          key={index}
        >
          {label}
        </TableCell>
      )),
      network: row.network,
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
        <Button size="large" variant="contained" onClick={handleClick}>
          Reload
        </Button>
      </div>
      {dataExists ? (
        <TableComponent
          row={ROW}
          columns={columns}
          openModal={isOpenModal}
          onClickRow={handleModalActions}
        />
      ) : (
        'noDATA'
      )}
    </>
  );
};
