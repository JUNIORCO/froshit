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
import { useUser } from '@supabase/auth-helpers-react';

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
  const user = useUser();

  return (
    <Page title='Set Password'>
      <Container>
        <ContentStyle sx={{ textAlign: 'center' }}>
          {user && user.email ? (
            <>
              <SentIcon sx={{ mb: 5, mx: 'auto', height: 120 }} />
              <Typography variant='h3' gutterBottom>
                Welcome to FROSHIT, {user.user_metadata.firstName} {user.user_metadata.lastName}!
              </Typography>
              <Typography variant='h4'>
                Set a password
              </Typography>
              <Box sx={{ mt: 5, mb: 3 }}>
                <SetPasswordForm email={user.email}/>
              </Box>
            </>) : <Typography>Oops! Looks like you're in the wrong place...</Typography>}

        </ContentStyle>
      </Container>
    </Page>
  );
}
