import { Box, Container, Stack, Typography } from '@mui/material';
import Page from '../../../../components/Page';
import Logo from '../../../../components/Logo';
import { LoginForm } from '../../../../sections/auth/login';
import GuestGuard from '../../../../guards/GuestGuard';
import { ContentStyle, HeaderStyle, RootStyle } from '../../../../styles/auth';

export default function LoginPage() {
  return (
    <GuestGuard>
      <Page title='Login'>
        <RootStyle>
          <HeaderStyle>
            <Logo />
          </HeaderStyle>

          <Container maxWidth='sm'>
            <ContentStyle>
              <Stack direction='row' alignItems='center' sx={{ mb: 5 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant='h4' gutterBottom>
                    Sign in
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Enter your details below.
                  </Typography>
                </Box>

                <Logo university sx={{ width: 64, height: 64 }} />
              </Stack>

              <LoginForm />
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}
