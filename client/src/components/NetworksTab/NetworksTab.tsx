import React, { FC, useMemo, useState } from 'react';

import { useQuery } from 'react-query';

import { getBlockchainNetwork } from '../../api/rest/blockchainNetwork';
import { ActionBlockchainNetworkAll } from '../../types/action';
import { FullScreenLoader } from '../FullScreenLoader';
import { Column, TableComponent } from '../TableComponent';
import { Button } from '@mui/material';

const columns: Column[] = [
  { id: 'id', label: 'id' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Descriprion' },
];

export const NetworksTab: FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModalActions = (state: boolean, id: string = '') => {
    setIsOpenModal(state);
    console.log(id);
  };

  const blockchainNetworkData = useQuery('blockchainNetwork', () =>
    getBlockchainNetwork({
      paginate: { page: 1, count: 10 },
      sort: { name: '_id', type: 'asc' },
      filter: {},
    }),
  );

  // mb good idea transfer it with button component to hook
  const handleClick = () => {
    blockchainNetworkData.refetch();
  };

  const ROW: Record<Column['id'], string>[] = useMemo(() => {
    return blockchainNetworkData?.data?.data.map((row: ActionBlockchainNetworkAll) => ({
      id: row._id,
      name: row.name,
      description: row.description,
    }));
  }, [blockchainNetworkData]);

  if (blockchainNetworkData.isFetching) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <Button size="large" variant="contained" onClick={handleClick}>
          Reload
        </Button>
      </div>
      <TableComponent
        row={ROW}
        columns={columns}
        openModal={isOpenModal}
        onClickRow={handleModalActions}
      />
    </>
  );
};
