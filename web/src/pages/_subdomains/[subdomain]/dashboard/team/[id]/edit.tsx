import { Container } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { FullTeam, UnassignedFrosheesAndLeaders } from '../../../../../../../prisma/api/@types';
import type { Frosh } from '../../../../../../../prisma/types';
import TeamEditForm from '../../../../../../sections/@dashboard/team/TeamEditForm';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import { Query } from '../../../../../../@types/query';
import AuthApi from '../../../../../../../prisma/api/AuthApi';

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

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query as Query;

  const api = new AuthApi({ ctx });

  const team = await api.Team.getFullTeamById(id);
  const froshs = await api.Frosh.getFroshs();
  const profiles = await api.Profile.getUnassignedFrosheesAndLeaders();

  return {
    props: {
      team,
      froshs,
      profiles,
    },
  };
};
