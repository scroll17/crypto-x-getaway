import React, { FC, useMemo } from 'react';

import { useQuery } from 'react-query';
import { Button } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { users } from '@api-r/action/user';
import { ActionUserEntity, ActionUserQueryKeys } from '@types/action/user';
import { calcUsersOnline } from '@utils/calcUsersOnline';

import { FullScreenLoader } from '../../FullScreenLoader';
import { Column, TableComponent } from '../../TableComponent';

const columns: Column[] = [
  { id: 'id', label: 'id' },
  { id: 'userName', label: 'Name' },
  { id: 'botAccess', label: 'Bot Access' },
  {
    id: 'online',
    label: 'Online',
  },
  {
    id: 'lastActivity',
    label: 'Last Activity',
  },
];

export const UsersTab: FC = () => {
  // const [paginationModel, setPaginationModel] = React.useState({
  //   pageSize: 10,
  //   page: 0,
  // });

  const usersData = useQuery(
    ActionUserQueryKeys.UserAll,
    () =>
      users({
        paginate: { page: 1, count: 10 },
        sort: { name: '_id', type: 'asc' },
      }),
    { select: data => data.data },
  );

  const dataExists = usersData && usersData.data?.length > 0;

  // mb good idea transfer it with button component to hook
  const handleClick = () => {
    usersData.refetch();
  };

  const ROW: Record<Column['id'], string>[] = useMemo(() => {
    if (!dataExists) return [];

    const { data } = usersData;

    return data.map((row: ActionUserEntity) => ({
      id: row._id,
      userName: row.name,
      botAccess: (
        <FiberManualRecordIcon sx={{ pl: 2 }} color={row.hasBotAccess ? 'success' : 'secondary'} />
      ),
      online: (
        <FiberManualRecordIcon
          sx={{ pl: 2 }}
          color={
            calcUsersOnline(row.lastActivityAt ?? new Date(0).toString()) ? 'error' : 'success'
          }
        />
      ),
      lastActivity: row.lastActivityAt ? new Date(row.lastActivityAt).toLocaleString() : '-',
    }));
  }, [usersData]);

  if (usersData.isFetching) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <Button size="large" variant="contained" onClick={handleClick}>
          Reload
        </Button>
      </div>
      <TableComponent row={ROW} columns={columns} dataCheck={dataExists} />
    </>
  );
};
