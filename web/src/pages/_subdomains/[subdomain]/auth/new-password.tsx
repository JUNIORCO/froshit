import { Box, Container, Typography } from '@mui/material';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import { NewPasswordForm } from '../../../../sections/auth/new-password';
import { SentIcon } from '../../../../assets';
import { ReactElement } from 'react';
import { ContentStyle } from './styles';

NewPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant='logoOnly'>{page}</Layout>;
};

export default function NewPasswordPage() {
  return (
    <Page title='New Password'>
      <Container>
        <ContentStyle>
          <SentIcon sx={{ mb: 5, mx: 'auto', height: 120 }} />

          <Typography variant='h3' gutterBottom>
            Password reset form
          </Typography>

          <Box sx={{ mt: 5, mb: 3 }}>
            <NewPasswordForm />
          </Box>

        </ContentStyle>
      </Container>
    </Page>
  );
}
