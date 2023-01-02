import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Page from '../../../../components/Page';
import Logo from '../../../../components/Logo';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Frosh, University } from '../../../../../prisma/types';
import PublicApi from '../../../../../prisma/api/PublicApi';
import CheckoutForm from '../../../../components/checkout/CheckoutForm';
import { FrosheeRegistrationProvider } from '../../../../contexts/FrosheeRegistrationContext';
import { ContentStyle, HeaderStyle, RootStyle } from './styles';

type FrosheeRegisterProps = {
  university: University & { froshs: Frosh[] };
}

export default function Register({ university }: FrosheeRegisterProps) {
  return (
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
  );
}

export const getServerSideProps: GetServerSideProps<FrosheeRegisterProps> = async (ctx: GetServerSidePropsContext) => {
  const { subdomain } = ctx.query;
  const api = new PublicApi();

  const university = await api.getUniversityForFrosheeRegistration(subdomain as string);

  return {
    props: {
      university,
    },
  };
};
