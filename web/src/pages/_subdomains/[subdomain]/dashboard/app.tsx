// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack } from '@mui/material';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// _mock_
import { _appAuthors, _appInstalled, _appInvoices, _appRelated } from '../../../../_mock';
// components
import Page from '../../../../components/Page';
// sections
import {
  AppAreaInstalled,
  AppCurrentDownload,
  AppNewInvoice,
  AppTopAuthors,
  AppTopInstalledCountries,
  AppTopRelated,
  AppWidget,
  AppWidgetSummary,
} from '../../../../sections/@dashboard/general/app';
import { GetServerSideProps } from 'next';
// assets

GeneralApp.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function GeneralApp() {
  const theme = useTheme();

  const { themeStretch } = useSettings();

  return (
    <Page title='General: App'>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={4}>

          {/*<Grid item xs={12} md={4}>*/}
          {/*  <AppWidgetSummary*/}
          {/*    title='Total Active Users'*/}
          {/*    percent={2.6}*/}
          {/*    total={18765}*/}
          {/*    chartColor={theme.palette.primary.main}*/}
          {/*    chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}*/}
          {/*  />*/}
          {/*</Grid>*/}

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title='Total Active Users'
              percent={2.6}
              total={18765}
              chartColor={theme.palette.primary.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title='Total Installed'
              percent={0.2}
              total={4876}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title='Total Downloads'
              percent={-0.1}
              total={678}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title='Current Download'
              chartColors={[
                theme.palette.primary.lighter,
                theme.palette.primary.light,
                theme.palette.primary.main,
                theme.palette.primary.dark,
              ]}
              chartData={[
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled
              title='Area Installed'
              subheader='(+43%) than last year'
              chartLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']}
              chartData={[
                {
                  year: '2019',
                  data: [
                    { name: 'Asia', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
                    { name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                    { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                  ],
                },
              ]}
            />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}

/**
 * Why export an empty function?
 * The _app file uses getInitialProps, which may sometime run on the client
 * The issue is that when the user first gets to the login page, the profile that is fetched in getInitialProps in _app
 * will be empty.
 * Then the user logs in, and getInitialProps runs on the client, so profile is still empty
 * We have to run getInitialProps in _app on the server again, and this export ensure that
 */
export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});
