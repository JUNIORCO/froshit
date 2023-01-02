import { TableCell, TableRow } from '@mui/material';
import { Role } from '../../../../../prisma/types';
import { FroshsWithStats } from '../../../../../prisma/api/@types';
import { fCurrency } from 'src/utils/formatNumber';

type Props = {
  row: FroshsWithStats;
};

export default function FroshTableRow({ row }: Props) {
  const { name, price , profiles, _count } = row;

  return (
    <TableRow hover>
      <TableCell align='left'>
        {name}
      </TableCell>

      <TableCell align='center'>
        {fCurrency(price / 100)}
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
    </TableRow>
  );
}
