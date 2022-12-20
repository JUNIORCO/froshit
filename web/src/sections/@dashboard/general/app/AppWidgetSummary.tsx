import { Box, Card, CardProps, Typography } from '@mui/material';
import { fNumber } from '../../../../utils/formatNumber';

interface Props extends CardProps {
  title: string;
  total: number;
}

export default function AppWidgetSummary({
                                           title,
                                           total,
                                           sx,
                                           ...other
                                         }: Props) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant='subtitle1'>{title}</Typography>
        <Typography variant='h4'>{fNumber(total)}</Typography>
      </Box>
    </Card>
  );
}
