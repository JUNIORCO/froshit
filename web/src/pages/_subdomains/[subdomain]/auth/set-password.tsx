import { Box, Container, Typography } from '@mui/material';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import { SetPasswordForm } from '../../../../sections/auth/set-password';
import { SentIcon } from '../../../../assets';
import { useUser } from '@supabase/auth-helpers-react';
import { ContentStyle } from '../../../../styles/auth';
import { ReactElement } from 'react';

SetPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant='logoOnly'>{page}</Layout>;
};

export default function SetPasswordPage() {
  const user = useUser();

  return (
    <Page title='Set Password'>
      <Container>
        <ContentStyle>
          {user && user.email ? (
            <>
              <SentIcon sx={{ mb: 5, mx: 'auto', height: 120 }} />
              <Typography variant='h4' gutterBottom>
                Welcome to FROSHIT, {user.user_metadata.firstName} {user.user_metadata.lastName}!
              </Typography>
              <Typography variant='h5'>
                Set a password
              </Typography>
              <Box sx={{ mt: 5, mb: 3 }}>
                <SetPasswordForm email={user.email} />
              </Box>
            </>) : null}

        </ContentStyle>
      </Container>
    </Page>
  );
}
