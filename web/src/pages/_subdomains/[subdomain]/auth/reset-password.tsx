import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { Button, Container, Typography } from '@mui/material';
import { PATH_AUTH } from '../../../../routes/paths';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import { ResetPasswordForm } from '../../../../sections/auth/reset-password';
import GuestGuard from '../../../../guards/GuestGuard';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

ResetPassword.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant='logoOnly'>{page}</Layout>;
};

export default function ResetPassword() {
  return (
    <GuestGuard>
      <Page title='Reset Password'>
        <Container>
          <ContentStyle sx={{ textAlign: 'center' }}>
            <Typography variant='h3' paragraph>
              Forgot your password?
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
              Please enter the email address associated with your account and we will email you a link
              to reset your password.
            </Typography>

            <ResetPasswordForm />

            <NextLink href={PATH_AUTH.login} passHref style={{ textDecoration: 'none' }}>
              <Button fullWidth size='large' sx={{ mt: 1 }}>
                Back
              </Button>
            </NextLink>
          </ContentStyle>
        </Container>
      </Page>
    </GuestGuard>
  );
}
