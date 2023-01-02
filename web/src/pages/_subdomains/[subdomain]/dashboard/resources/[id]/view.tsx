// @mui
import { Box, Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import AuthApi from '../../../../../../../prisma/api/AuthApi';

TeamView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function TeamView({ team }: any) {
  return (
    <Page title='View Team'>
      <Container>
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
  const { id } = ctx.query;
  const api = new AuthApi({ ctx });

  const team = await api.Team.getFullTeamById(id as string);

  return {
    props: {
      team,
    },
  };
};
