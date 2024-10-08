import { Container } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ResourceTag } from '../../../../../../../prisma/types';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import AuthApi from '../../../../../../../prisma/api/AuthApi';
import ResourceTagEditForm from 'src/sections/dashboard/resource-tags/ResourceTagEditForm';

ResourceEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  resourceTag: ResourceTag;
}

export default function ResourceEdit({ resourceTag }: Props) {
  return (
    <Page title='Resource Tag Edit'>
      <Container>
        <HeaderBreadcrumbs
          heading='Edit Resource Tag'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Resource Tags', href: PATH_DASHBOARD.resourceTag.root },
            { name: 'Edit' },
          ]}
        />
        <ResourceTagEditForm currentResourceTag={resourceTag} view />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query;
  const api = new AuthApi({ ctx });

  const resourceTag = await api.Resource.getResourceTagById(id as string);

  return {
    props: {
      resourceTag,
    },
  };
};
