import { capitalCase } from 'change-case';
// @mui
import { Box, Container, Tab, Tabs } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
// hooks
import useTabs from '../../../../../../hooks/useTabs';
import useSettings from '../../../../../../hooks/useSettings';
// _mock_
import { _userAddressBook, _userInvoices, _userPayment } from '../../../../../../_mock';
// layouts
import Layout from '../../../../../../layouts';
// components
import Page from '../../../../../../components/Page';
import Iconify from '../../../../../../components/Iconify';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
// sections
import {
  AccountBilling,
  AccountChangePassword,
  AccountGeneral,
} from '../../../../../../sections/@dashboard/user/account';
import { GetServerSideProps } from 'next';
import { getTeamById } from '../../../../../../../prisma/team/get';

// ----------------------------------------------------------------------

TeamView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function TeamView({ team }: any) {
  const { themeStretch } = useSettings();

  return (
    <Page title='View Team'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Team'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Team', href: PATH_DASHBOARD.team.root },
            { name: 'View' },
          ]}
        />

        <Box sx={{ mb: 5 }} />

      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { subdomain, id } = ctx.query;
  const team = await getTeamById(Number(id));

  return {
    props: {
      team,
    },
  };
};
