import { useState } from 'react';
import { MenuItem, TableCell, TableRow } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { Role } from '../../../../../prisma/types';
import { FroshsWithStats } from '../../../../../prisma/api/@types';

type Props = {
  row: FroshsWithStats;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function FroshTableRow({
                                        row,
                                        onEditRow,
                                        onViewRow,
                                        onDeleteRow,
                                      }: Props) {
  const { name, profiles, _count } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover>

      <TableCell align='left'>
        {name}
      </TableCell>

      <TableCell align='center'>
        {profiles.filter((profile) => profile.role === Role.Froshee && profile.paid).length}
      </TableCell>

      <TableCell align='center'>
        {profiles.filter((profile) => profile.role === Role.Froshee).length}
      </TableCell>

      <TableCell align='center'>
        {profiles.filter((profile) => profile.role === Role.Leader).length}
      </TableCell>

      <TableCell align='center'>
        {_count.teams}
      </TableCell>

      <TableCell align='center'>
        {_count.events}
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
