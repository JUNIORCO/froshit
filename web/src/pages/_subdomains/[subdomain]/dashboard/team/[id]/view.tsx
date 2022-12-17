// @mui
import { Box, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
// hooks
import useSettings from '../../../../../../hooks/useSettings';
// _mock_
// layouts
import Layout from '../../../../../../layouts';
// components
import Page from '../../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
// sections
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Query } from '../../../../../../@types/query';
import AuthApi from '../../../../../../../prisma/api/AuthApi';

// ----------------------------------------------------------------------

TeamView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function TeamView({ team }: any) {
  const { themeStretch } = useSettings();

  return (
    <Page title='View Team'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Team'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Team', href: PATH_DASHBOARD.team.root },
            { name: 'View' },
          ]}
        />

        <Box sx={{ mb: 5 }} />

      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query as Query;
  const api = new AuthApi({ ctx });

  const team = await api.Team.getFullTeamById(id);

  return {
    props: {
      team,
    },
  };
};
