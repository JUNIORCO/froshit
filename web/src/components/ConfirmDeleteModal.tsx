import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DialogAnimate } from './animate';
import React from 'react';

type ConfirmDeleteModal = {
  open: boolean;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
  title: string;
  content: string;
}

export default function ConfirmDeleteModal({ open, onClose, onConfirm, title, content }: ConfirmDeleteModal) {
  return (
    <DialogAnimate open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </DialogAnimate>
  );
}
