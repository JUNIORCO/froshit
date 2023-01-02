import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FullEvent } from '../../../../../../../prisma/api/@types';
import AuthApi from '../../../../../../../prisma/api/AuthApi';
import EventEditForm from '../../../../../../sections/dashboard/event/EventEditForm';
import React from 'react';

EventView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  event: FullEvent;
}

export default function EventView({ event }: Props) {
  return (
    <Page title='View Event'>
      <Container>
        <HeaderBreadcrumbs
          heading='Event'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Event', href: PATH_DASHBOARD.event.root },
            { name: 'View' },
          ]}
        />
        <EventEditForm view currentEvent={event} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query;
  const api = new AuthApi({ ctx });

  const event = await api.Event.getEventById(id as string);

  return {
    props: {
      event,
    },
  };
};
