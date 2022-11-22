import { Box, Container, Typography } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import UserNewEditForm from '../../../../../../sections/@dashboard/user/UserNewEditForm';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FullProfile } from '../../../../../../../prisma/api/@types';
import type { Frosh, Program, Team } from '../../../../../../../prisma/types';
import { Query } from '../../../../../../@types/query';
import AuthApi from '../../../../../../../prisma/api/AuthApi';

UserEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

interface UserEditProps {
  user: FullProfile;
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

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { subdomain, id } = ctx.query as Query;

  const api = new AuthApi({ ctx });

  const user = await api.Profile.getFullProfileById(id);
  const programs = await api.Program.getPrograms();
  const froshs = await api.Frosh.getFroshs();
  const teams = await api.Team.getTeamsWithFrosh();

  return {
    props: {
      user,
      programs,
      froshs,
      teams,
    },
  };
};
