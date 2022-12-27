import React from 'react';
import { Avatar, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import { Profile, Role } from '../../../../../../prisma/types';
import Iconify from '../../../../../components/Iconify';
import createAvatar from '../../../../../utils/createAvatar';
import useProfile from '../../../../../hooks/useProfile';

type Props = {
  row: Profile;
  onDeleteRow: VoidFunction;
};

export default function AdminOrganizerTableRow({ row, onDeleteRow }: Props) {
  const { profile } = useProfile();
  const { firstName, lastName, email, phoneNumber, role, imageUrl } = row;

  const renderAvatarFromImageUrl = () => (<Avatar alt={firstName} src={imageUrl!} sx={{ mr: 2 }} />);

  const renderAvatarFromName = () => (<Avatar alt={firstName} sx={{ mr: 2 }}>{createAvatar(firstName).name}</Avatar>);

  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {imageUrl === '' || !imageUrl ? (renderAvatarFromName()) : (renderAvatarFromImageUrl())}
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
          disabled={role === Role.Organizer && profile!.role === Role.Organizer}
        >
          <Iconify icon={'eva:trash-2-outline'} />
        </MenuItem>
      </TableCell>
    </TableRow>
  );
}
