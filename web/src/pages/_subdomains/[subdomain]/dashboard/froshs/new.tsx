import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import FroshNewForm from '../../../../../sections/@dashboard/frosh/FroshNewForm';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import AuthApi from '../../../../../../prisma/api/AuthApi';

FroshCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function FroshCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title='Create Frosh'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Create a New Frosh'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Frosh', href: PATH_DASHBOARD.team.root },
            { name: 'New' },
          ]}
        />
        <FroshNewForm />
      </Container>
    </Page>
  );
}

/**
 * Why export an empty function?
 * The _app file uses getInitialProps, which may sometime run on the client
 * The issue is that when the user first gets to the login page, the profile that is fetched in getInitialProps in _app
 * will be empty.
 * Then the user logs in, and getInitialProps runs on the client, so profile is still empty
 * We have to run getInitialProps in _app on the server again, and this export ensure that
 */
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
    },
  };
};

