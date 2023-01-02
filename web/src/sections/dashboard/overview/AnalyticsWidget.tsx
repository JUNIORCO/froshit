import { Card, Typography, CardProps } from '@mui/material';
import { fShortenNumber } from '../../../utils/formatNumber';
import { ColorSchema } from '../../../theme/palette';

interface Props extends CardProps {
  title: string;
  total: number;
  color?: ColorSchema;
  formatter?: any;
}

export default function AnalyticsWidget({
                                                 title,
                                                 total,
                                                 color = 'primary',
                                                 formatter,
                                                 sx,
                                                 ...other
                                               }: Props) {
  return (
    <Card
      sx={{
        py: 2,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >

      <Typography variant="h3">{formatter ? formatter(fShortenNumber(total)) : fShortenNumber(total)}</Typography>

      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </Card>
  );
}
