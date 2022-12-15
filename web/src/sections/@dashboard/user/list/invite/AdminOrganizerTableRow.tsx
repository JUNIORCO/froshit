import React from 'react';
import { Avatar, TableCell, TableRow, Typography } from '@mui/material';
import { Profile } from '../../../../../../prisma/types';

type Props = {
  row: Profile;
};

export default function AdminOrganizerTableRow({ row }: Props) {
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

    </TableRow>
  );
}
