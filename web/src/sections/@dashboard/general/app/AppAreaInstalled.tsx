import merge from 'lodash/merge';
import { useState } from 'react';
import { Box, Card, CardHeader, CardProps, TextField } from '@mui/material';
import ReactApexChart, { BaseOptionChart } from '../../../../components/chart';

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chartLabels: string[];
  chartData: {
    froshName: string;
    data: number[];
  }[];
}

export default function AppAreaInstalled({
                                           title,
                                           subheader,
                                           chartLabels,
                                           chartData,
                                           ...other
                                         }: Props) {
  const [selectedFrosh, setSelectedFrosh] = useState('All');

  const handleChangeSeriesData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFrosh(event.target.value);
  };

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: chartLabels,
    },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <TextField
            select
            fullWidth
            value={selectedFrosh}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': {
                pl: 1,
                py: 0.5,
                pr: '24px !important',
                typography: 'subtitle2',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.75,
                bgcolor: 'background.neutral',
              },
              '& .MuiNativeSelect-icon': {
                top: 4,
                right: 0,
                width: 20,
                height: 20,
              },
            }}
          >
            {chartData.map((option) => (
              <option key={option.froshName} value={option.froshName}>
                {option.froshName}
              </option>
            ))}
          </TextField>
        }
      />

      {chartData.map((item) => (
        item.froshName === selectedFrosh && (
          <Box key={item.froshName} sx={{ mt: 3, mx: 3 }} dir='ltr'>
            <ReactApexChart
              type='line'
              series={[{ name: item.froshName, data: item.data }]}
              options={chartOptions}
              height={364} />
          </Box>
        )
      ))}
    </Card>
  );
}
