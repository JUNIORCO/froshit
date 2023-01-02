import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ResourceTag } from 'prisma/types';
import ResourceNewForm from '../../../../../sections/dashboard/resource/ResourceNewForm';
import AuthApi from '../../../../../../prisma/api/AuthApi';

ResourceCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  resourceTags: ResourceTag[];
}

export default function ResourceCreate({ resourceTags }: Props) {
  const { themeStretch } = useSettings();

  return (
    <Page title='Create Resource'>
      <Container>
        <HeaderBreadcrumbs
          heading='Create a New Resource'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Resource', href: PATH_DASHBOARD.resource.root },
            { name: 'New' },
          ]}
        />
        <ResourceNewForm resourceTags={resourceTags} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });
  const resourceTags = await api.Resource.getResourceTags();

  return {
    props: {
      resourceTags,
    },
  };
};
