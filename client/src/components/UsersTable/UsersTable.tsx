import React, { FC, useMemo } from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Paper, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { useQuery } from 'react-query';

import { UsersTableHead } from './UsersTableHead';
import { users } from '../../api/rest/action/user';
import { ActionUser } from '../../types/action';
import { FullScreenLoader } from '../FullScreenLoader';

export interface Column {
  id: 'id' | 'userName' | 'botAccess' | 'online' | 'lastActivity';
  label: string;
  minWidth?: number;
  align?: 'left';
}

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

export const UsersTable: FC = () => {
  // const [paginationModel, setPaginationModel] = React.useState({
  //   pageSize: 10,
  //   page: 0,
  // });

  const usersData = useQuery('users', () =>
    users({
      paginate: { page: 1, count: 10 },
      sort: { name: '_id', type: 'asc' },
      filter: {},
    }),
  );

  const ROW: Record<Column['id'], string>[] = useMemo(() => {
    return usersData?.data?.data.map((row: ActionUser) => ({
      id: row._id,
      userName: row.name,
      botAccess: (
        <FiberManualRecordIcon sx={{ pl: 2 }} color={row.hasBotAccess ? 'success' : 'secondary'} />
      ),
      online: <FiberManualRecordIcon sx={{ pl: 2 }} color={true ? 'error' : 'secondary'} />,
      // lastActivity: row.lastActivityAt,
    }));
  }, [usersData]);

  if (usersData.isFetching) {
    return <FullScreenLoader />;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <UsersTableHead columns={columns} />
          <TableBody>
            {ROW &&
              ROW.map(row => {
                return (
                  <TableRow hover key={row.id}>
                    {columns.map(column => {
                      const value = row[column.id];

                      return <TableCell key={column.id}>{value}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
