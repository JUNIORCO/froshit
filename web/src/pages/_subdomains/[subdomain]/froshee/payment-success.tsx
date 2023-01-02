import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Page from '../../../../components/Page';
import Logo from '../../../../components/Logo';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ContentStyle, HeaderStyle, RootStyle } from './styles';

export default function PaymentSuccess() {
  return (
    <Page title='Payment Success'>
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>
        <Container>
          <ContentStyle>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant='h4' gutterBottom>
                  Payment Success
                </Typography>
              </Box>
              <Logo university disabledLink sx={{ width: 64, height: 64 }} />
            </Box>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {},
  };
};
