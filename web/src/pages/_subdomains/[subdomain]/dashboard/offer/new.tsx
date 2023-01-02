import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import OfferNewForm from '../../../../../sections/dashboard/offer/OfferNewForm';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

OfferCreatePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function OfferCreatePage() {
  return (
    <Page title='Add Offer'>
      <Container>
        <HeaderBreadcrumbs
          heading='Add Offer'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Offer', href: PATH_DASHBOARD.offer.root },
            { name: 'New' },
          ]}
        />
        <OfferNewForm />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {},
  };
};
