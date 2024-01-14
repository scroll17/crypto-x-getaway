import React, { FC, ReactNode } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material';

interface CustomModalProps {
  isOpen: boolean;
  handleClose: () => void;
  children: ReactNode;
}

export const CustomModal: FC<CustomModalProps> = ({ isOpen, handleClose, children }) => {
  return (
    <>
      <Dialog maxWidth="xl" fullWidth open={isOpen} onClose={handleClose}>
        <DialogTitle display="flex" justifyContent="end">
          <IconButton edge="end" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </>
  );
};
