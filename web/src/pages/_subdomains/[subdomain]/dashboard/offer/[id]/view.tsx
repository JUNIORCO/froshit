import { Container } from '@mui/material';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { Offer } from '../../../../../../../prisma/types';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import OfferEditForm from '../../../../../../sections/dashboard/offer/OfferEditForm';
import AuthApi from '../../../../../../../prisma/api/AuthApi';

OfferView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  offer: Offer;
}

export default function OfferView({ offer }: Props) {
  return (
    <Page title='Offer View'>
      <Container>
        <HeaderBreadcrumbs
          heading='Edit Offer'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Offer', href: PATH_DASHBOARD.offer.root },
            { name: 'View' },
          ]}
        />
        <OfferEditForm currentOffer={offer} view />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query;
  const api = new AuthApi({ ctx });

  const offer = await api.Offer.getOfferById(id as string);

  return {
    props: {
      offer,
    },
  };
};
