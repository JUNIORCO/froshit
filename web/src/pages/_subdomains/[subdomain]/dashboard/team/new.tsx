import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import TeamNewForm from '../../../../../sections/dashboard/team/TeamNewForm';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import { ReactElement } from 'react';
import { FroshsWithStats, UnassignedFrosheesAndLeaders } from '../../../../../../prisma/api/@types';

AddTeamPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};


type AddTeamPageProps = {
  froshs: FroshsWithStats[];
  profiles: UnassignedFrosheesAndLeaders[];
}

export default function AddTeamPage({ froshs, profiles }: AddTeamPageProps) {
  return (
    <Page title='Add Team'>
      <Container>
        <HeaderBreadcrumbs
          heading='Add Team'
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

export const getServerSideProps: GetServerSideProps<AddTeamPageProps> = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });

  const [froshs, profiles] = await Promise.all([
    api.Frosh.getFroshsWithStats(),
    api.Profile.getUnassignedFrosheesAndLeaders(),
  ]);

  return {
    props: {
      froshs,
      profiles,
    },
  };
};
