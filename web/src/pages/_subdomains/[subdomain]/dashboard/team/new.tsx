// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// hooks
import useSettings from '../../../../../hooks/useSettings';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import TeamNewForm from '../../../../../sections/@dashboard/team/TeamNewForm';
import Api from '../../../../../../prisma/api/Api';

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

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new Api({ ctx });
  const froshs = await api.Frosh.getFroshsWithStats();
  const profiles = await api.Profile.getUnassignedFrosheesAndLeaders();

  return {
    props: {
      froshs,
      profiles,
    },
  };
};
