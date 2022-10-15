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
import { getUserById } from '../../../../../../../prisma/user/get';
import { getProfileRoles } from '../../../../../../../prisma/roles/roles';
import { getProfileInterests } from '../../../../../../../prisma/interests/interests';
import { getPrograms } from '../../../../../../../prisma/programs/get';
import { getFroshs } from '../../../../../../../prisma/froshs/get';
import { getTeams } from '../../../../../../../prisma/team/get';

// ----------------------------------------------------------------------

UserView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserView({ user }: any) {
  const { themeStretch } = useSettings();

  const { currentTab, onChangeTab } = useTabs('general');

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral user={user}/>,
    },
    {
      value: 'change_password',
      icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <Page title='View User'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Account'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'View' },
          ]}
        />

        <Tabs
          allowScrollButtonsMobile
          variant='scrollable'
          scrollButtons='auto'
          value={currentTab}
          onChange={onChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { subdomain, id } = ctx.query;
  const user = await getUserById(Number(id));

  return {
    props: {
      user,
    },
  };
};
