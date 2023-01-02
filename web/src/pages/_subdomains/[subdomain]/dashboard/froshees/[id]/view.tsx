import { Container } from '@mui/material';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import FrosheeNewEditViewForm from '../../../../../../sections/dashboard/froshee/FrosheeNewEditViewForm';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import AuthApi from '../../../../../../../prisma/api/AuthApi';
import React, { ReactElement } from 'react';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import { FrosheeEditViewProps } from '../../../../../../@types/froshees';

FrosheeView.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function FrosheeView({ froshee, froshs, teams }: FrosheeEditViewProps) {
  return (
    <Page title='View Froshee'>
      <Container>
        <HeaderBreadcrumbs
          heading='View Froshee'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Froshees', href: PATH_DASHBOARD.froshees.root },
            { name: 'View' },
          ]}
        />

        <FrosheeNewEditViewForm froshee={froshee} froshs={froshs} teams={teams} view />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps<FrosheeEditViewProps> = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query;
  const api = new AuthApi({ ctx });

  const [froshee, froshs, teams] = await Promise.all([
    api.Profile.getFullProfileById(id as string),
    api.Frosh.getFroshs(),
    api.Team.getTeamsWithFrosh(),
  ]);

  return {
    props: {
      froshee,
      froshs,
      teams,
    },
  };
};
