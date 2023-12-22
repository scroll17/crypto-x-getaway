import React, { FC } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Modal,
  Button,
  Box,
} from '@mui/material';

export interface Column {
  id:
    | 'id'
    | 'userName'
    | 'botAccess'
    | 'online'
    | 'lastActivity'
    | 'name'
    | 'description'
    | 'labels'
    | 'createdBy'
    | 'network';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left';
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface TableProps {
  row: Record<string, string>[];
  columns: Column[];
  dataCheck: boolean;
  onClickRow?: (action: boolean, id?: string) => void;
  openModal?: boolean;
}

export const TableComponent: FC<TableProps> = ({
  row,
  columns,
  onClickRow,
  openModal,
  dataCheck,
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

                      return <TableCell key={column.id}>{value}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={openModal ?? false} onClose={handleCloseModal}>
        <Box sx={{ ...style, width: 200 }}>
          <h2 id="child-modal-title">Text in a child modal</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleCloseModal}>Close Child Modal</Button>
        </Box>
      </Modal>
    </Paper>
  );
};
