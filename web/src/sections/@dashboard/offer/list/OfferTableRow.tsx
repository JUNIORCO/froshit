import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Checkbox, MenuItem, TableCell, TableRow } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { Offer, Role } from '../../../../../prisma/types';

type Props = {
  row: Offer;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function OfferTableRow({
                                        row,
                                        selected,
                                        onEditRow,
                                        onSelectRow,
                                        onViewRow,
                                      }: Props) {
  const theme = useTheme();

  const { title, description, location, provider } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>

      <TableCell align='left'>
        {provider}
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
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
