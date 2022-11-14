import { Box, Container, Typography } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import UserNewEditForm from '../../../../../../sections/@dashboard/user/UserNewEditForm';
import { GetServerSideProps } from 'next';
import { FullUser, getFullUserById } from '../../../../../../../prisma/user/get';
import { getPrograms } from '../../../../../../../prisma/programs/get';
import { getFroshs } from '../../../../../../../prisma/froshs/get';
import { getTeams } from '../../../../../../../prisma/team/get';
import type { Frosh, Program, Team } from '../../../../../../../prisma/types';
import { Query } from '../../../../../../@types/query';

UserEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

interface UserEditProps {
  user: FullUser;
  programs: Program[];
  froshs: Frosh[];
  teams: Team[];
}

export default function UserEdit({ user, programs, froshs, teams }: UserEditProps) {
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

        <UserNewEditForm currentUser={user} programs={programs} froshs={froshs} teams={teams} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { subdomain, id } = ctx.query as Query;
  const user = await getFullUserById(id);

  const programs = await getPrograms();
  const froshs = await getFroshs();
  const teams = await getTeams();

  return {
    props: {
      user,
      programs,
      froshs,
      teams,
    },
  };
};
