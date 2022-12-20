// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// _mock_
// components
import Page from '../../../../components/Page';
// sections
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
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
        <Typography>Coming Soon...</Typography>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {},
  };
};
