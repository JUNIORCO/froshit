import React from 'react';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import UserNewEditForm from '../../../../../sections/@dashboard/user/UserNewEditForm';
import { GetServerSideProps } from 'next';
import { getPrograms } from '../../../../../../prisma/programs/get';
import { getFroshs } from '../../../../../../prisma/froshs/get';
import { getTeams } from '../../../../../../prisma/team/get';
import type { Frosh, Program, Team } from '../../../../../../prisma/types';

UserCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  programs: Program[];
  froshs: Frosh[];
  teams: Team[];
}

export default function UserCreate({ programs, froshs, teams }: Props) {
  const { themeStretch } = useSettings();

  return (
    <Page title='Create User'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Create a New User'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'New user' },
          ]}
        />
        <UserNewEditForm programs={programs} froshs={froshs} teams={teams} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const [programs, froshs, teams] = await Promise.all([getPrograms(), getFroshs(), getTeams()]);

  return {
    props: {
      programs,
      froshs,
      teams,
    },
  };
};
