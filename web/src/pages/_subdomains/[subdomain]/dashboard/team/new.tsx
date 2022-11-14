// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// hooks
import useSettings from '../../../../../hooks/useSettings';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps } from 'next';
import { getFroshs } from '../../../../../../prisma/froshs/get';
import { getUnassignedFrosheesAndLeaders } from '../../../../../../prisma/user/get';
import TeamNewForm from '../../../../../sections/@dashboard/team/TeamNewForm';

TeamCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

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
            { name: 'New' },
          ]}
        />
        <TeamNewForm froshs={froshs} profiles={profiles} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const froshs = await getFroshs();
  const profiles = await getUnassignedFrosheesAndLeaders();

  return {
    props: {
      froshs,
      profiles,
    },
  };
};
