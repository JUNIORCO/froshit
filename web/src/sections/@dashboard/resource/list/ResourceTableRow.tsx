import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { FullResource } from '../../../../../prisma/resources/get';

type Props = {
  row: FullResource;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function ResourceTableRow({
                                           row,
                                           onEditRow,
                                           onViewRow,
                                         }: Props) {
  const theme = useTheme();

  const { title, description, phoneNumber, email, resourceTag } = row;

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
          {title}
        </Typography>
      </TableCell>

      <TableCell align='left'>
        {resourceTag.name}
      </TableCell>

      <TableCell align='left'>
        {description}
      </TableCell>

      <TableCell align='left'>
        {phoneNumber}
      </TableCell>

      <TableCell align='left'>
        {email}
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
