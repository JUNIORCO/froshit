import { Container } from '@mui/material';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ResourceTag } from '../../../../../../../prisma/types';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import { FullResource } from '../../../../../../../prisma/api/@types';
import ResourceEditForm from '../../../../../../sections/dashboard/resource/ResourceEditForm';
import AuthApi from '../../../../../../../prisma/api/AuthApi';

ResourceEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  resource: FullResource;
  resourceTags: ResourceTag[];
}

export default function ResourceEdit({ resource, resourceTags }: Props) {
  return (
    <Page title='Resource Edit'>
      <Container>
        <HeaderBreadcrumbs
          heading='Edit Resource'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Resource', href: PATH_DASHBOARD.resource.root },
            { name: 'Edit' },
          ]}
        />
        <ResourceEditForm resource={resource} resourceTags={resourceTags} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query;
  const api = new AuthApi({ ctx });

  const [resource, resourceTags] = await Promise.all([
    await api.Resource.getResourceById(id as string),
    api.Resource.getResourceTags(),
  ]);

  return {
    props: {
      resource,
      resourceTags,
    },
  };
};
