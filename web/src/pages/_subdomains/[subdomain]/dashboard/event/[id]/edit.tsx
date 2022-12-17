import { Container } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import EventEditForm from '../../../../../../sections/@dashboard/event/EventEditForm';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import React from 'react';
import type { Frosh } from '../../../../../../../prisma/types';
import { Query } from '../../../../../../@types/query';
import AuthApi from '../../../../../../../prisma/api/AuthApi';
import { FullEvent } from '../../../../../../../prisma/api/@types';

TeamEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  event: FullEvent;
  froshs: Frosh[];
}

export default function TeamEdit({ event, froshs }: Props) {
  const { themeStretch } = useSettings();

  return (
    <Page title='Event Edit'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
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
  const { id } = ctx.query as Query;

  const api = new AuthApi({ ctx });
  const event = await api.Event.getEventById(id);
  const froshs = await api.Frosh.getFroshs();

  return {
    props: {
      event,
      froshs,
    },
  };
};
