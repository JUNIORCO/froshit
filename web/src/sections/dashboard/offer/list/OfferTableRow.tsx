import { useState } from 'react';
import { Avatar, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { Offer } from '../../../../../prisma/types';

type Props = {
  row: Offer;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function OfferTableRow({
                                        row,
                                        onEditRow,
                                        onViewRow,
                                        onDeleteRow,
                                      }: Props) {
  const { title, description, location, provider, imageUrl } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={provider} src={imageUrl} sx={{ mr: 2 }} />
        <Typography variant='subtitle2' noWrap>
          {provider}
        </Typography>
      </TableCell>

      <TableCell align='left'>
        {title}
      </TableCell>

      <TableCell align='left'>
        {description}
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
