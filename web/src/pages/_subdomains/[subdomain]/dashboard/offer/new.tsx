import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import FroshNewForm from '../../../../../sections/@dashboard/frosh/FroshNewForm';

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
