import React, { useState } from 'react';
import { Avatar, Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import type { UsersForUserList } from '../../../../../prisma/user/get';
import { Role } from '../../../../../prisma/types';

type Props = {
  row: UsersForUserList;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function UserTableRow({
                                       row,
                                       selected,
                                       onEditRow,
                                       onSelectRow,
                                       onViewRow,
                                     }: Props) {
  const { avatarUrl, name, email, phoneNumber, role, frosh, team, paid } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const displayPaidIcon = () => {
    if (role === Role.Admin || role === Role.Organizer) {
      return;
    }

    if (paid) {
      return (<Iconify
        icon={'eva:checkmark-circle-fill'}
        sx={{
          width: 25,
          height: 25,
          color: 'success.main',
        }}
      />);
    }

    return (<Iconify
      icon={'eva:alert-circle-outline'}
      sx={{
        width: 25,
        height: 25,
        color: 'warning.main',
      }}
    />);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding='checkbox'>
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />
        <Typography variant='subtitle2' noWrap>
          {name}
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

      <TableCell align='left'>
        {frosh && frosh.name}
      </TableCell>

      <TableCell align='left'>
        {team && team.name}
      </TableCell>

      <TableCell align='left'>
        {displayPaidIcon()}
      </TableCell>

      <TableCell align='right'>
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onViewRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-outline'} />
                View
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
