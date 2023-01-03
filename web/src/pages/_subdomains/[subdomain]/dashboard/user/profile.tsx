import React from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps } from 'next';
import { AccountChangePassword, AccountGeneral } from '../../../../../sections/dashboard/user/account';
import Iconify from '../../../../../components/Iconify';
import useTabs from '../../../../../hooks/useTabs';
import { capitalCase } from 'change-case';

UserProfile.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function UserProfile() {
  const { currentTab, onChangeTab } = useTabs('general');

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral />,
    },
    {
      value: 'change_password',
      icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <Page title='Your Profile'>
      <Container>
        <HeaderBreadcrumbs
          heading='Your Profile'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Profile' },
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

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
