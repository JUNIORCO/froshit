import { Container } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { Frosh } from '../../../../../../../prisma/types';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import FroshEditForm from '../../../../../../sections/@dashboard/frosh/FroshEditForm';
import { Query } from '../../../../../../@types/query';
import type { ReactElement } from 'react';
import AuthApi from '../../../../../../../prisma/api/AuthApi';

FroshEdit.getLayout = function getLayout(page: ReactElement) {
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

export const getServerSideProps: GetServerSideProps<Props> = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query as Query;
  const api = new AuthApi({ ctx });
  const frosh = await api.Frosh.getFroshById(id);

  return {
    props: {
      frosh,
    },
  };
};
