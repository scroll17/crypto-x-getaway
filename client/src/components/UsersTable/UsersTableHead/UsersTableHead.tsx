import React, { FC } from 'react';

import { TableCell, TableHead, TableRow } from '@mui/material';

import { Column } from '../UsersTable';
type Props = {
  columns: Column[];
};

export const UsersTableHead: FC<Props> = ({ columns }) => {
  return (
    <TableHead>
      <TableRow>
        {columns.map(column => (
          <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
