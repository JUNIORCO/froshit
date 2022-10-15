// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// hooks
import useSettings from '../../../../../hooks/useSettings';
// layouts
import Layout from '../../../../../layouts';
// components
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
// sections
import { GetServerSideProps } from 'next';
import { getFroshs } from '../../../../../../prisma/froshs/get';
import { getFrosheesAndLeadersWithNoTeam } from '../../../../../../prisma/user/get';
import TeamNewEditForm from '../../../../../sections/@dashboard/team/TeamNewEditForm';

// ----------------------------------------------------------------------

TeamCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function TeamCreate({ froshs, profiles }: any) {
  const { themeStretch } = useSettings();

  return (
    <Page title='Create Team'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Create a New Team'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Team', href: PATH_DASHBOARD.team.root },
            { name: 'New Team' },
          ]}
        />
        <TeamNewEditForm froshs={froshs} profiles={profiles} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const froshs = await getFroshs();
  const profiles = await getFrosheesAndLeadersWithNoTeam();

  return {
    props: {
      froshs,
      profiles,
    },
  };
};
