import React from 'react';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import UserNewEditForm from '../../../../../sections/@dashboard/user/UserNewEditForm';
import { GetServerSideProps } from 'next';
import type { Frosh, Team } from '../../../../../../prisma/types';
import AuthApi from '../../../../../../prisma/api/AuthApi';

UserCreateFroshee.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  froshs: Frosh[];
  teams: Team[];
}

export default function UserCreateFroshee({ froshs, teams }: Props) {
  const { themeStretch } = useSettings();

  return (
    <Page title='Create Froshee'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Create a New Froshee'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Froshees', href: PATH_DASHBOARD.froshees.root },
            { name: 'New' },
          ]}
        />
        <UserNewEditForm froshs={froshs} teams={teams} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const api = new AuthApi({ ctx });
  const [froshs, teams] = await Promise.all([api.Frosh.getFroshs(), api.Team.getTeamsWithFrosh()]);

  return {
    props: {
      froshs,
      teams,
    },
  };
};
