import { capitalCase } from 'change-case';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import useTabs from '../../../../../../hooks/useTabs';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import Iconify from '../../../../../../components/Iconify';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { AccountChangePassword, AccountGeneral } from '../../../../../../sections/@dashboard/user/account';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { FullProfile } from '../../../../../../../prisma/api/@types';
import { Query } from '../../../../../../@types/query';
import Api from '../../../../../../../prisma/api/Api';

UserView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

interface UserViewProps {
  user: FullProfile;
}

export default function UserView({ user }: UserViewProps) {
  const { themeStretch } = useSettings();

  const { currentTab, onChangeTab } = useTabs('general');

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral user={user} />,
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

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query as Query;

  const api = new Api({ ctx });
  const user = await api.Profile.getFullProfileById(id);

  return {
    props: {
      user,
    },
  };
};
