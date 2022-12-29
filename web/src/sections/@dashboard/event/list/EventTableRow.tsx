import { useState } from 'react';
import { MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { FullEvent } from '../../../../../prisma/api/@types';
import dayjs from 'dayjs';

type Props = {
  row: FullEvent;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function EventTableRow({
                                        row,
                                        selected,
                                        onEditRow,
                                        onViewRow,
                                        onDeleteRow,
                                      }: Props) {
  const { name, froshs, startDate, endDate, location } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ alignItems: 'center' }}>
        <Typography variant='subtitle2'>
          {name}
        </Typography>
      </TableCell>

      <TableCell align='left'>
        {froshs.map(({ name }) => name)}
      </TableCell>

      <TableCell align='left'>
        {dayjs(startDate).format('MMM D YYYY @ h:mm A')}
      </TableCell>

      <TableCell align='left'>
        {dayjs(endDate).format('MMM D YYYY @ h:mm A')}
      </TableCell>

      <TableCell align='left'>
        {location}
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
