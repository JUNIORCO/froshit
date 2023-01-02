import React, { ReactElement } from 'react';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import FrosheeNewEditViewForm from '../../../../../sections/dashboard/froshee/FrosheeNewEditViewForm';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import { NewFrosheeProps } from '../../../../../@types/froshees';

NewFrosheePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function NewFrosheePage({ froshs, teams }: NewFrosheeProps) {
  return (
    <Page title='Add Froshee'>
      <Container>
        <HeaderBreadcrumbs
          heading='Add Froshee'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Froshees', href: PATH_DASHBOARD.froshees.root },
            { name: 'New' },
          ]}
        />
        <FrosheeNewEditViewForm froshs={froshs} teams={teams} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps<NewFrosheeProps> = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });

  const [froshs, teams] = await Promise.all([
    api.Frosh.getFroshs(),
    api.Team.getTeamsWithFrosh(),
  ]);

  return {
    props: {
      froshs,
      teams,
    },
  };
};
