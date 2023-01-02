import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps } from 'next';
import ResourceTagNewForm from '../../../../../sections/dashboard/resource-tags/ResourceTagNewForm';

ResourceCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function ResourceCreate() {
  return (
    <Page title='Create Resource Tag'>
      <Container>
        <HeaderBreadcrumbs
          heading='Create a New Resource Tag'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Resource Tag', href: PATH_DASHBOARD.resourceTag.root },
            { name: 'New' },
          ]}
        />
        <ResourceTagNewForm />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
