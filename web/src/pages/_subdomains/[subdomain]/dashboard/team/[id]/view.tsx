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
import { GetServerSideProps } from 'next';
import { getTeamById } from '../../../../../../../prisma/team/get';
import { Query } from '../../../../../../@types/query';

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { subdomain, id } = ctx.query as Query;
  const team = await getTeamById(id);

  return {
    props: {
      team,
    },
  };
};
