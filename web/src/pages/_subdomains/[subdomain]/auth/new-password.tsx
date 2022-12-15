// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Link, Typography } from '@mui/material';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import { NewPasswordForm } from '../../../../sections/auth/new-password';
import { SentIcon } from '../../../../assets';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

NewPassword.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant='logoOnly'>{page}</Layout>;
};

export default function NewPassword() {
  return (
    <Page title='New Password'>
      <Container>
        <ContentStyle sx={{ textAlign: 'center' }}>
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
