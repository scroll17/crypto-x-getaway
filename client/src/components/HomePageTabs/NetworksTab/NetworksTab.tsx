import React, { FC, useMemo, useState } from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Button } from '@mui/material';
import { useQuery } from 'react-query';

import { getAllBlockchainNetwork } from '../../../api/rest/action/blockchain/network';
import {
  ActionBlockchainNetworkAll,
  BlockchainNetworkQueryKeys,
} from '../../../types/action/blockchain/network';
import { FullScreenLoader } from '../../FullScreenLoader';
import { Column, TableComponent } from '../../TableComponent';

const columns: Column[] = [
  { id: 'id', label: 'id' },
  { id: 'name', label: 'Name', style: { fontWeight: 'bold' } },
  {
    id: 'localName',
    label: 'Local Name',
    style: { backgroundColor: '#dfdfdf ', border: '1px solid' },
  },
  { id: 'family', label: 'Family' },
  { id: 'token', label: 'Token', style: { fontWeight: 'bold' } },
  { id: 'level', label: 'Level' },
  { id: 'networkId', label: 'Network Id' },
  { id: 'available', label: 'Available' },
];

export const NetworksTab: FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModalActions = (state: boolean, id: string = '') => {
    setIsOpenModal(state);
    console.log(id);
  };

  const blockchainNetworkData = useQuery(
    BlockchainNetworkQueryKeys.blockchainNetworkAll,
    () =>
      getAllBlockchainNetwork({
        paginate: { page: 1, count: 10 },
        sort: { name: '_id', type: 'asc' },
      }),
    { select: data => data.data },
  );

  const dataExists = blockchainNetworkData && blockchainNetworkData.data?.length > 0;

  // mb good idea transfer it with button component to hook
  const handleClick = () => {
    blockchainNetworkData.refetch();
  };

  const ROW: Record<Column['id'], string>[] = useMemo(() => {
    if (!dataExists) return [];

    const { data } = blockchainNetworkData;

    return data.map((row: ActionBlockchainNetworkAll) => ({
      id: row._id,
      name: row.name,
      localName: row.localName,
      family: row.family,
      token: row.currencySymbol,
      level: row.prototypeLevel,
      networkId: row.networkId,
      available: (
        <FiberManualRecordIcon sx={{ pl: 2 }} color={row.available ? 'success' : 'error'} />
      ),
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
        dataCheck={dataExists}
      />
    </>
  );
};
