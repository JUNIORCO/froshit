import { Container } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps } from 'next';
import { ResourceTag } from '../../../../../../../prisma/types';
import TeamEditForm from '../../../../../../sections/@dashboard/team/TeamEditForm';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import { Query } from '../../../../../../@types/query';
import { FullResource, getResourceById } from '../../../../../../../prisma/resources/get';
import { getResourceTags } from '../../../../../../../prisma/resources/resourceTags';
import ResourceEditForm from '../../../../../../sections/@dashboard/resource/ResourceEditForm';

ResourceEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  resource: FullResource;
  resourceTags: ResourceTag[];
}

export default function ResourceEdit({ resource, resourceTags }: Props) {
  const { themeStretch } = useSettings();

  return (
    <Page title='Resource Edit'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { subdomain, id } = ctx.query as Query;

  const resource = await getResourceById(id);
  const resourceTags = await getResourceTags();

  return {
    props: {
      resource,
      resourceTags,
    },
  };
};
