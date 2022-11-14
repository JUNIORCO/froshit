import { Box, Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps } from 'next';
import { FullEvent, getEventById } from '../../../../../../../prisma/events/get';
import { Query } from '../../../../../../@types/query';

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

  const event = await getEventById(id);

  return {
    props: {
      event,
    },
  };
};
