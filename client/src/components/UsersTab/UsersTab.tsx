import React, { FC, useMemo } from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Button } from '@mui/material';
import { useQuery } from 'react-query';

import { users } from '../../api/rest/action/user';
import { ActionUser, User } from '../../types/action';
import { calcUsersOnline } from '../../utils/calcUsersOnline';
import { FullScreenLoader } from '../FullScreenLoader';
import { Column, TableComponent } from '../TableComponent';

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
    User.UserAll,
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

    return data.map((row: ActionUser) => ({
      id: row._id,
      userName: row.name,
      botAccess: (
        <FiberManualRecordIcon sx={{ pl: 2 }} color={row.hasBotAccess ? 'success' : 'secondary'} />
      ),
      online: (
        <FiberManualRecordIcon
          sx={{ pl: 2 }}
          color={calcUsersOnline(row.lastActivityAt) ? 'error' : 'success'}
        />
      ),
      lastActivity: new Date(row.lastActivityAt).toLocaleString(),
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
      {dataExists ? <TableComponent row={ROW} columns={columns} /> : 'noDATA'}
    </>
  );
};
