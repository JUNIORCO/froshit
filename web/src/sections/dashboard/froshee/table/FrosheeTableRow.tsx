import React, { useState } from 'react';
import { Avatar, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import type { UsersForUserList } from '../../../../../prisma/api/@types';
import createAvatar from '../../../../utils/createAvatar';

type Props = {
  row: UsersForUserList;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function FrosheeTableRow({
                                          row,
                                          onEditRow,
                                          onViewRow,
                                        }: Props) {
  const { firstName, lastName, email, phoneNumber, frosh, team, payment, imageUrl } = row;
  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const renderAvatarFromImageUrl = () => (<Avatar alt={firstName} src={imageUrl!} sx={{ mr: 2 }} />);

  const renderAvatarFromName = () => (<Avatar alt={firstName} sx={{ mr: 2 }}>{createAvatar(firstName).name}</Avatar>);

  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {imageUrl === '' || !imageUrl ? renderAvatarFromName() : renderAvatarFromImageUrl()}
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

      <TableCell align='left'>
        {frosh?.name}
      </TableCell>

      <TableCell align='left'>
        {team?.name}
      </TableCell>

      <TableCell align='left'>
        {payment?.type}
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
