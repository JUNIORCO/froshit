import { Container } from '@mui/material';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import EventEditForm from '../../../../../../sections/dashboard/event/EventEditForm';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import React from 'react';
import type { Frosh } from '../../../../../../../prisma/types';
import AuthApi from '../../../../../../../prisma/api/AuthApi';
import { FullEvent } from '../../../../../../../prisma/api/@types';

EventEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  event: FullEvent;
  froshs: Frosh[];
}

export default function EventEdit({ event, froshs }: Props) {
  return (
    <Page title='Edit Event'>
      <Container>
        <HeaderBreadcrumbs
          heading='Edit Event'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Event', href: PATH_DASHBOARD.event.root },
            { name: 'Edit' },
          ]}
        />
        <EventEditForm currentEvent={event} froshs={froshs} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query;
  const api = new AuthApi({ ctx });

  const [event, froshs] = await Promise.all([
    api.Event.getEventById(id as string),
    api.Frosh.getFroshs(),
  ]);

  return {
    props: {
      event,
      froshs,
    },
  };
};
