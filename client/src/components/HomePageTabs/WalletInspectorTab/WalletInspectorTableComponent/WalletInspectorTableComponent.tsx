import React, {FC} from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from '@mui/material';

import {FullScreenLoader} from '../../../FullScreenLoader';

export interface Column {
  id: string;
  label: string | React.ReactNode;
  // should be transfer to style
  minWidth?: number;
  maxWidth?: number;
  align?: 'left';
  style?: Record<string, string>;
}

interface TableProps {
  row: Record<string, unknown>[];
  columns: Column[];
  dataCheck: boolean;
  isLoading?: boolean;
}

export const WalletInspectorTableComponent: FC<TableProps> = ({
  row,
  columns,
  dataCheck,
  isLoading,
}) => {
  if (!dataCheck) {
    return (
      <div
        style={{
          margin: 'auto',
          textAlign: 'center',
          fontWeight: 'bold'
        }}
      >
        There is no data
      </div>
    );
  }

  if(isLoading) {
    return (
      <div style={{ display: 'flex', height: '300px' }}>
        <FullScreenLoader />
      </div>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, ...column.style }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {row &&
              row.map(row => {
                return (
                  <TableRow
                    style={{}}
                    hover
                    key={row.id}
                  >
                    {columns.map(column => {
                      const value = row[column.id];

                      return (
                        <TableCell style={{ ...column.style }} key={column.id}>
                          {value}
                        </TableCell>
                      );
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
