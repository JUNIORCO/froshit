import merge from 'lodash/merge';
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, CardProps } from '@mui/material';
import ReactApexChart, { BaseOptionChart } from '../../../components/chart';

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important' as 'relative',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chartData: {
    label: string;
    value: number;
  }[];
  chartColors?: string[];
  labelFormatter: any;
}

export default function AnalyticsPieChart({
                                             title,
                                             subheader,
                                             chartData,
                                             chartColors,
                                             labelFormatter,
                                             ...other
                                           }: Props) {
  const theme = useTheme();

  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false },
      textAnchor: 'middle',
      formatter: function(_val: any, opts: any) {
        return [opts.w.config.labels[opts.seriesIndex], labelFormatter(opts.w.config.series[opts.seriesIndex])];
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName: string) => labelFormatter(seriesName),
        title: {
          formatter: (seriesName: string) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <ChartWrapperStyle dir='ltr'>
        <ReactApexChart type='pie' series={chartSeries} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
