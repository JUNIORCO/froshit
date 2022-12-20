// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// _mock_
// components
import Page from '../../../../components/Page';
// sections
import { AppAreaInstalled, AppCurrentDownload } from '../../../../sections/@dashboard/general/app';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import AuthApi from '../../../../../prisma/api/AuthApi';
import { Analytics } from '../../../../../prisma/api/@types';
import { getAnalysisColors } from 'src/config';
import { fCurrency, fNumber } from '../../../../utils/formatNumber';
import { AnalyticsWidgetSummary } from '../../../../sections/@dashboard/general/analytics';
// assets

AnalyticsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function AnalyticsPage({
                                        totalAmountPaid,
                                        totalOrganizers,
                                        totalLeaders,
                                        totalFroshees,
                                        froshFrosheeCount,
                                        froshLeaderCount,
                                        froshsTotalAmountPaid,
                                        frosheesRegisteredAnalytics,
                                      }: Analytics) {
  const theme = useTheme();

  const { themeStretch } = useSettings();

  return (
    <Page title='General: App'>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={3}>
            <AnalyticsWidgetSummary
              title='Total Amount Paid'
              total={totalAmountPaid}
              color='success'
              formatter={fCurrency}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <AnalyticsWidgetSummary
              title='Total Organizers'
              total={totalOrganizers}
              color='info'
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <AnalyticsWidgetSummary
              title='Total Leaders'
              total={totalLeaders}
              color='warning'
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <AnalyticsWidgetSummary
              title='Total Froshees'
              total={totalFroshees}
              color='error'
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title='Paid Per Frosh'
              chartColors={getAnalysisColors(theme)}
              chartData={froshsTotalAmountPaid.map(froshAnalysis => ({
                label: froshAnalysis.froshName.split(/\s(.+)/)[0],
                value: froshAnalysis.totalAmountPaid,
              }))}
              labelFormatter={fCurrency}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title='Leaders Per Frosh'
              chartColors={getAnalysisColors(theme)}
              chartData={froshLeaderCount.map(froshProfile => ({
                label: froshProfile.froshName.split(/\s(.+)/)[0],
                value: froshProfile.profileCount,
              }))}
              labelFormatter={fNumber}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title='Froshees Per Frosh'
              chartColors={getAnalysisColors(theme)}
              chartData={froshFrosheeCount.map(froshProfile => ({
                label: froshProfile.froshName.split(/\s(.+)/)[0],
                value: froshProfile.profileCount,
              }))}
              labelFormatter={fNumber}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppAreaInstalled
              title='Froshees Registered'
              subheader='Past 7 days only'
              chartLabels={frosheesRegisteredAnalytics.dates}
              chartData={frosheesRegisteredAnalytics.data}
            />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });
  const analytics = await api.Analytics.getAnalyticsForDashboard();
  return {
    props: {
      ...analytics,
    },
  };
};
