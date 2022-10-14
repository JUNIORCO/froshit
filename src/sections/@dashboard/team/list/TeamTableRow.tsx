import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function TeamTableRow({
                                       row,
                                       selected,
                                       onEditRow,
                                       onSelectRow,
                                       onViewRow,
                                     }: Props) {
  const theme = useTheme();

  const { name: teamName, frosh, profiles } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding='checkbox'>
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ alignItems: 'center' }}>
        <Typography variant='subtitle2'>
          {teamName}
        </Typography>
      </TableCell>

      <TableCell align='left'>
        {frosh.name}
      </TableCell>

      <TableCell align='left'>
        {profiles.filter((profile) => profile.role === 'Leader').map((profile) => profile.name).join(', ').slice(0, 100)}
      </TableCell>

      <TableCell align='left'>
        {profiles.filter((profile) => profile.role === 'Froshee').map((profile) => profile.name).join(', ').slice(0, 100)}
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
