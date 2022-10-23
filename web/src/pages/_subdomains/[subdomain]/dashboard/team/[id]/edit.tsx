import { Box, Container, Typography } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps } from 'next';
import { getUnassignedFrosheesAndLeaders, UnassignedFrosheesAndLeaders } from '../../../../../../../prisma/user/get';
import { getFroshs } from '../../../../../../../prisma/froshs/get';
import { getTeamById, FullTeam } from '../../../../../../../prisma/team/get';
import type { Frosh } from '../../../../../../../prisma/types';
import TeamEditForm from '../../../../../../sections/@dashboard/team/TeamEditForm';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';

TeamEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  team: FullTeam;
  froshs: Frosh[];
  profiles: UnassignedFrosheesAndLeaders[];
}

export default function TeamEdit({ team, froshs, profiles }: Props) {
  const { themeStretch } = useSettings();

  return (
    <Page title='Team Edit'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Edit Team'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Team', href: PATH_DASHBOARD.team.root },
            { name: 'Edit' },
          ]}
        />
        <TeamEditForm currentTeam={team} froshs={froshs} profiles={profiles} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { subdomain, id } = ctx.query;

  const team = await getTeamById(Number(id));
  const froshs = await getFroshs();
  const profiles = await getUnassignedFrosheesAndLeaders();

  return {
    props: {
      team,
      froshs,
      profiles,
    },
  };
};
