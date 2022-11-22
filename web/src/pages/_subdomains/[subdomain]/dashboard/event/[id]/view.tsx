import { Box, Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps } from 'next';
import { FullEvent } from '../../../../../../../prisma/api/@types';
import { Query } from '../../../../../../@types/query';
import Api from '../../../../../../../prisma/api/Api';

EventView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  event: FullEvent;
}

export default function EventView({ event }: Props) {
  const { themeStretch } = useSettings();

  return (
    <Page title='View Event'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Event'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Event', href: PATH_DASHBOARD.event.root },
            { name: 'View' },
          ]}
        />

        <Box sx={{ mb: 5 }} />

      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { subdomain, id } = ctx.query as Query;
  const api = new Api({ ctx });
  const event = await api.Event.getEventById(id);

  return {
    props: {
      event,
    },
  };
};
