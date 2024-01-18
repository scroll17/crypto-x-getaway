import React, { FC, ReactNode } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from '@mui/material';

import { CustomModal } from '../CustomModal/CustomModal';

export interface Column {
  id:
    | 'id'
    | 'userName'
    | 'botAccess'
    | 'online'
    | 'lastActivity'
    | 'name'
    | 'localName'
    | 'labels'
    | 'createdBy'
    | 'network'
    | 'family'
    | 'token'
    | 'level'
    | 'networkId'
    | 'available';
  label: string;
  // should be transfer to style
  minWidth?: number;
  maxWidth?: number;
  align?: 'left';
  style?: Record<string, string>;
}

interface TableProps {
  row: Record<string, string>[];
  columns: Column[];
  dataCheck: boolean;
  onClickRow?: (action: boolean, id?: string) => void;
  openModal?: boolean;
  modalChildren?: ReactNode;
  isLoading?: boolean;
}

export const TableComponent: FC<TableProps> = ({
  row,
  columns,
  onClickRow,
  openModal,
  dataCheck,
  modalChildren,
  isLoading,
}) => {
  const handleCloseModal = () => {
    onClickRow && onClickRow(false);
  };

  const handleOpenModal = (id: string) => {
    onClickRow && onClickRow(true, id);
  };

  if (!dataCheck) return 'noDATA';

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
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
                    style={onClickRow && { cursor: 'pointer' }}
                    hover
                    key={row.id}
                    onClick={() => handleOpenModal(row.id)}
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
      {!isLoading && (
        <CustomModal isOpen={openModal ?? false} handleClose={handleCloseModal}>
          {modalChildren}
        </CustomModal>
      )}
    </Paper>
  );
};
