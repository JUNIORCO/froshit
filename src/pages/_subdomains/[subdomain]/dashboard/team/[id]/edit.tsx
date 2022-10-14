// next
import { useRouter } from 'next/router';
// @mui
import { Box, Container, Typography } from '@mui/material';
// routes
// hooks
import useSettings from '../../../../../../hooks/useSettings';
// _mock_
// layouts
import Layout from '../../../../../../layouts';
// components
import Page from '../../../../../../components/Page';
// sections
import UserNewEditForm from '../../../../../../sections/@dashboard/user/UserNewEditForm';
import { GetServerSideProps } from 'next';
import { getProfileRoles } from '../../../../../../../prisma/roles/roles';
import { getUserById } from '../../../../../../../prisma/user/get';
import { getProfileInterests } from '../../../../../../../prisma/interests/interests';
import { getPrograms } from '../../../../../../../prisma/programs/get';
import { getFroshs } from '../../../../../../../prisma/froshs/get';
import { getTeams } from '../../../../../../../prisma/team/get';

// ----------------------------------------------------------------------

UserEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserEdit({ user, roles, interests, programs, froshs, teams }: any) {
  const { themeStretch } = useSettings();

  return (
    <Page title='User Edit'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant='h4' gutterBottom>
                Edit User
              </Typography>
            </Box>
          </Box>
        </Box>

        <UserNewEditForm isEdit currentUser={user} roles={roles} interests={interests} programs={programs} froshs={froshs} teams={teams} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { subdomain, id } = ctx.query;
  const user = await getUserById(Number(id));

  const roles = getProfileRoles();
  const interests = getProfileInterests();
  const programs = await getPrograms();
  const froshs = await getFroshs();
  const teams = await getTeams();

  return {
    props: {
      user,
      roles,
      interests,
      programs,
      froshs,
      teams: team,
    },
  };
};
