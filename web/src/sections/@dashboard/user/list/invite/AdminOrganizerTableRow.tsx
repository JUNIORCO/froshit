import React from 'react';
import { Avatar, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import { Profile } from '../../../../../../prisma/types';
import Iconify from '../../../../../components/Iconify';

type Props = {
  row: Profile;
  onDeleteRow: VoidFunction;
};

export default function AdminOrganizerTableRow({ row, onDeleteRow }: Props) {
  const { firstName, lastName, email, phoneNumber, role } = row;

  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={firstName}
                src={'https://minimal-assets-api-dev.vercel.app/assets/images/avatars/avatar_default.jpg'}
                sx={{ mr: 2 }} />
        <Typography variant='subtitle2' noWrap>
          {`${firstName} ${lastName}`}
        </Typography>
      </TableCell>

      <TableCell align='left'>
        {email}
      </TableCell>

      <TableCell align='left'>
        {phoneNumber}
      </TableCell>

      <TableCell align='left' sx={{ textTransform: 'capitalize' }}>
        {role}
      </TableCell>
      <TableCell align='center'>
        <MenuItem
          onClick={onDeleteRow}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon={'eva:trash-2-outline'} />
        </MenuItem>
      </TableCell>
    </TableRow>
  );
}
