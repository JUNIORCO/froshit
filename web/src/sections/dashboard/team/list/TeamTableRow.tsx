import { useState } from 'react';
import { MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { FullTeam } from '../../../../../prisma/api/@types';
import { Role } from '../../../../../prisma/types';

type Props = {
  row: FullTeam;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function TeamTableRow({
                                       row,
                                       onEditRow,
                                       onViewRow,
                                       onDeleteRow,
                                     }: Props) {
  const { name: teamName, number: teamNumber, frosh, profiles } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover>
      <TableCell sx={{ alignItems: 'center' }}>
        <Typography variant='subtitle2'>
          {teamName}
        </Typography>
      </TableCell>

      <TableCell align='left'>
        {teamNumber}
      </TableCell>

      <TableCell align='left'>
        {frosh?.name}
      </TableCell>

      <TableCell align='left'>
        {profiles?.filter((profile) => profile.role === Role.Leader).length}
      </TableCell>

      <TableCell align='left'>
        {profiles?.filter((profile) => profile.role === Role.Froshee).length}
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
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
