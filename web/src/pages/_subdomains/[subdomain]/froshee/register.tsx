import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import Page from '../../../../components/Page';
import Logo from '../../../../components/Logo';
import GuestGuard from '../../../../guards/GuestGuard';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Frosh, University } from '../../../../../prisma/types';
import PublicApi from '../../../../../prisma/api/PublicApi';
import CheckoutForm from '../../../../components/checkout/CheckoutForm';
import { FrosheeRegistrationProvider } from '../../../../contexts/FrosheeRegistrationContext';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));
const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

type RegisterProps = {
  university: University & { froshs: Frosh[] };
}

export default function Register({ university }: RegisterProps) {
  return (
    <GuestGuard>
      <Page title='Froshee Registration'>
        <RootStyle>
          <HeaderStyle>
            <Logo />
          </HeaderStyle>

          <Container>
            <ContentStyle>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant='h4' gutterBottom>
                    Froshee Registration
                  </Typography>
                </Box>
                <Logo university disabledLink sx={{ width: 64, height: 64 }} />
              </Box>
              <FrosheeRegistrationProvider university={university}>
                <CheckoutForm />
              </FrosheeRegistrationProvider>
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { subdomain } = ctx.query;
  const api = new PublicApi();

  const university = await api.getUniversityForFrosheeRegistration(subdomain as string);

  return {
    props: {
      university,
    },
  };
};
