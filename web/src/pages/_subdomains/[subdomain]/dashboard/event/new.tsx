import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Frosh } from '../../../../../../prisma/types';
import React from 'react';
import EventNewForm from '../../../../../sections/@dashboard/event/EventNewForm';
import AuthApi from '../../../../../../prisma/api/AuthApi';

EventCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  froshs: Frosh[];
}

export default function EventCreate({ froshs }: Props) {
  const { themeStretch } = useSettings();

  return (
    <Page title='Create Event'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Create a New Event'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Event', href: PATH_DASHBOARD.event.root },
            { name: 'New' },
          ]}
        />
        <EventNewForm froshs={froshs} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });
  const froshs = await api.Frosh.getFroshs();

  return {
    props: {
      froshs,
    },
  };
};
