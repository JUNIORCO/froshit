import { Container } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import EventEditForm from '../../../../../../sections/@dashboard/event/EventEditForm';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import { FullEvent, getEventById } from '../../../../../../../prisma/events/get';
import React from 'react';
import { getFroshs } from '../../../../../../../prisma/froshs/get';
import type { Frosh } from '../../../../../../../prisma/types';
import { Query } from '../../../../../../@types/query';

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
  const { subdomain, id } = ctx.query as Query;

  const event = await getEventById(id);
  const froshs = await getFroshs();

  return {
    props: {
      event,
      froshs,
    },
  };
};
