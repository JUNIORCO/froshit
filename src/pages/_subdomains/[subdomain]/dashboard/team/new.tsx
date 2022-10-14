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
import UserNewEditForm from '../../../../../sections/@dashboard/user/UserNewEditForm';
import { GetServerSideProps } from 'next';
import { getProfileRoles } from '../../../../../../prisma/roles/roles';
import { getProfileInterests } from '../../../../../../prisma/interests/interests';
import { getPrograms } from '../../../../../../prisma/programs/get';
import { getFroshs } from '../../../../../../prisma/froshs/get';
import { getTeams } from '../../../../../../prisma/team/get';

// ----------------------------------------------------------------------

UserCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserCreate({ roles, interests, programs, froshs, teams }: any) {
  const { themeStretch } = useSettings();

  return (
    <Page title='Create User'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Create a New User'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'New user' },
          ]}
        />
        <UserNewEditForm roles={roles} interests={interests} programs={programs} froshs={froshs} teams={teams} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const roles = getProfileRoles();
  const interests = getProfileInterests();
  const programs = await getPrograms();
  const froshs = await getFroshs();
  const teams = await getTeams();

  return {
    props: {
      roles,
      interests,
      programs,
      froshs,
      teams: team
    },
  };
};
