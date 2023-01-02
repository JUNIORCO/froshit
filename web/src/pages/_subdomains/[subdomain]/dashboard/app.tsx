import { useTheme } from '@mui/material/styles';
import { Button, Container, Grid } from '@mui/material';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import { AnalyticsPieChart, AnalyticsWidget, FrosheeRegistrationGraph } from '../../../../sections/dashboard/overview';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import AuthApi from '../../../../../prisma/api/AuthApi';
import { Analytics } from '../../../../../prisma/api/@types';
import { getAnalysisColors } from 'src/config';
import { fCurrency, fNumber } from '../../../../utils/formatNumber';
import NextLink from 'next/link';
import Iconify from '../../../../components/Iconify';
import React, { ReactElement } from 'react';
import useProfile from '../../../../hooks/useProfile';
import { Role } from 'prisma/types';

AnalyticsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function AnalyticsPage({
                                        university,
                                        totalAmountCollected,
                                        totalOrganizers,
                                        totalLeaders,
                                        totalFroshees,
                                        froshFrosheeCount,
                                        froshLeaderCount,
                                        froshsTotalAmountCollected,
                                        frosheesRegisteredAnalytics,
                                      }: Analytics) {
  const { profile } = useProfile();
  const theme = useTheme();

  return (
    <Page title='Overview'>
      <Container>
        <Grid container spacing={3}>

          {profile!.role === Role.Admin &&
          (<Grid item xs={12} md={12} sx={{ textAlign: 'end' }}>
            <NextLink href={university.stripeConnectedAccountLink} target='_blank' rel='noreferrer' passHref
                      style={{ textDecoration: 'none' }}>
              <Button
                variant='contained'
                endIcon={<Iconify icon={'material-symbols:arrow-circle-right-outline-rounded'} />}
              >
                Stripe Dashboard
              </Button>
            </NextLink>
          </Grid>)}

          <Grid item xs={12} md={3}>
            <AnalyticsWidget
              title='Estimated Amount Collected'
              total={totalAmountCollected}
              color='success'
              formatter={fCurrency}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <AnalyticsWidget
              title='Total Organizers'
              total={totalOrganizers}
              color='info'
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <AnalyticsWidget
              title='Total Leaders'
              total={totalLeaders}
              color='warning'
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <AnalyticsWidget
              title='Total Froshees'
              total={totalFroshees}
              color='error'
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsPieChart
              title='Collected Per Frosh'
              chartColors={getAnalysisColors(theme)}
              chartData={froshsTotalAmountCollected.map(froshAnalysis => ({
                label: froshAnalysis.froshName.split(/\s(.+)/)[0],
                value: froshAnalysis.totalOnlineAmountCollected + froshAnalysis.totalCashAmountCollected,
              }))}
              labelFormatter={fCurrency}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsPieChart
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
            <AnalyticsPieChart
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
            <FrosheeRegistrationGraph
              title='Froshees Registered'
              subheader='Past 7 days only'
              chartLabels={frosheesRegisteredAnalytics.dates}
              dailyChartData={frosheesRegisteredAnalytics.dailyData}
              cumulativeChartData={frosheesRegisteredAnalytics.cumulativeData}
            />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { subdomain } = ctx.query;
  const api = new AuthApi({ ctx });

  const analytics = await api.Analytics.getAnalyticsForDashboard(subdomain as string);

  return {
    props: analytics,
  };
};
