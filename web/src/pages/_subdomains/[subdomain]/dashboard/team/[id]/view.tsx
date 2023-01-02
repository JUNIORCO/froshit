import { Container } from '@mui/material';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { FullTeam, UnassignedFrosheesAndLeaders } from '../../../../../../../prisma/api/@types';
import type { Frosh } from '../../../../../../../prisma/types';
import TeamEditForm from '../../../../../../sections/dashboard/team/TeamEditForm';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import AuthApi from '../../../../../../../prisma/api/AuthApi';
import { ReactElement } from 'react';

TeamViewPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

type TeamEditPageProps = {
  team: FullTeam;
  froshs: Frosh[];
  profiles: UnassignedFrosheesAndLeaders[];
}

export default function TeamViewPage({ team, froshs, profiles }: TeamEditPageProps) {
  return (
    <Page title='View Team'>
      <Container>
        <HeaderBreadcrumbs
          heading='View Team'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Team', href: PATH_DASHBOARD.team.root },
            { name: 'Edit' },
          ]}
        />
        <TeamEditForm currentTeam={team} froshs={froshs} profiles={profiles} view />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps<TeamEditPageProps> = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query;
  const api = new AuthApi({ ctx });

  const [team, froshs, profiles] = await Promise.all([
    api.Team.getFullTeamById(id as string),
    api.Frosh.getFroshs(),
    api.Profile.getUnassignedFrosheesAndLeaders(),
  ]);

  return {
    props: {
      team,
      froshs,
      profiles,
    },
  };
};
