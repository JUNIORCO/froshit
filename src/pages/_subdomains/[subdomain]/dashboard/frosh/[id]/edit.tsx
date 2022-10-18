import { Container } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps } from 'next';
import { getFroshById } from '../../../../../../../prisma/froshs/get';
import type { Frosh } from '../../../../../../../prisma/types';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import FroshEditForm from '../../../../../../sections/@dashboard/frosh/FroshEditForm';

FroshEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  frosh: Frosh;
}

export default function FroshEdit({ frosh }: Props) {
  const { themeStretch } = useSettings();

  return (
    <Page title='Frosh Edit'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Edit Frosh'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Team', href: PATH_DASHBOARD.frosh.root },
            { name: 'Edit' },
          ]}
        />
        <FroshEditForm currentFrosh={frosh} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { subdomain, id } = ctx.query;

  const frosh = await getFroshById(Number(id));

  return {
    props: {
      frosh,
    },
  };
};
