import { Theme } from '@mui/material/styles';
import { SxProps, TableCell, TableHead, TableRow } from '@mui/material';

type Props = {
  headLabel: any[];
  sx?: SxProps<Theme>;
};

export default function TableHeadCustom({ headLabel, sx }: Props) {
  return (
    <TableHead sx={sx}>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection='desc'
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
