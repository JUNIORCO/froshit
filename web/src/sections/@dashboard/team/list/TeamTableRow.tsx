import { useState } from 'react';
import { MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { FullTeam } from '../../../../../prisma/api/@types';
import { Role } from '../../../../../prisma/types';

type Props = {
  row: FullTeam;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function TeamTableRow({
                                       row,
                                       selected,
                                       onEditRow,
                                       onViewRow,
                                     }: Props) {
  const { name: teamName, number: teamNumber, frosh, profiles } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  console.log(profiles);

  return (
    <TableRow hover selected={selected}>
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
        {profiles?.filter((profile) => profile.role === Role.Leader).map((profile) => `${profile.firstName} ${profile.lastName}`).join(', ').slice(0, 100)}
      </TableCell>

      <TableCell align='left'>
        {profiles?.filter((profile) => profile.role === Role.Froshee).map((profile) => `${profile.firstName} ${profile.lastName}`).join(', ').slice(0, 100)}
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
