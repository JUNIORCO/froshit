// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Link, Typography } from '@mui/material';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import { SetPasswordForm } from '../../../../sections/auth/set-password';
import { SentIcon } from '../../../../assets';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as queryString from 'querystring';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

SetPassword.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant='logoOnly'>{page}</Layout>;
};

export default function SetPassword() {
  const { asPath } = useRouter();
  const fragmentIdentifier = asPath.split('#');
  let parsedAuthInfo = null;

  if (fragmentIdentifier.length <= 1) {
    console.log('no fragment found');
  } else {
    const authInfo = fragmentIdentifier[1];
    const parsed = queryString.parse(authInfo);
    if (!parsed.error) {
      parsedAuthInfo = parsed;
    }
  }

  console.log('parsedAuthInfo : ', parsedAuthInfo);

  return (
    <Page title='Set Password'>
      <Container>
        <ContentStyle sx={{ textAlign: 'center' }}>
          {parsedAuthInfo ? (
            <>
              <SentIcon sx={{ mb: 5, mx: 'auto', height: 120 }} />
              <Typography variant='h3' gutterBottom>
                Welcome to FROSHIT!
              </Typography>
              <Typography variant='h4'>
                Set a password
              </Typography>
              <Box sx={{ mt: 5, mb: 3 }}>
                <SetPasswordForm />
              </Box>
            </>) : <Typography>Oops! Looks like you're in the wrong place...</Typography>}

        </ContentStyle>
      </Container>
    </Page>
  );
}
