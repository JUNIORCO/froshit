import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { Alert, Box, Container, Link, Stack, Typography } from '@mui/material';
import { PATH_AUTH } from '../../../../routes/paths';
import useResponsive from '../../../../hooks/useResponsive';
import Page from '../../../../components/Page';
import Logo from '../../../../components/Logo';
import { LoginForm } from '../../../../sections/auth/login';
import GuestGuard from '../../../../guards/GuestGuard';

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

type LoginProps = {
  subdomain?: string;
}

export default function Login({ subdomain }: LoginProps) {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <GuestGuard>
      <Page title='Login'>
        <RootStyle>
          <HeaderStyle>
            <Logo />
            {smUp && (
              <Typography variant='body2' sx={{ mt: { md: -2 } }}>
                Don’t have an account? {''}
                <NextLink href={PATH_AUTH.register} passHref style={{ textDecoration: 'none' }}>
                  <Link variant='subtitle2'>Get started</Link>
                </NextLink>
              </Typography>
            )}
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

                {/* TODO change to university logo */}
                <Logo sx={{ width: 64, height: 64 }} />
              </Stack>

              {subdomain === 'demo' && <Alert severity='info' sx={{ mb: 3 }}>
                Use email : <strong>demo@froshit.com</strong> / password :<strong> demo1234</strong>
              </Alert>}

              <LoginForm />

              {!smUp && (
                <Typography variant='body2' align='center' sx={{ mt: 3 }}>
                  Don’t have an account?{' '}
                  <NextLink href={PATH_AUTH.register} passHref style={{ textDecoration: 'none' }}>
                    <Link variant='subtitle2'>Get started</Link>
                  </NextLink>
                </Typography>
              )}
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}
