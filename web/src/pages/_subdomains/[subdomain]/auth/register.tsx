import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import { PATH_AUTH } from '../../../../routes/paths';
import Page from '../../../../components/Page';
import Logo from '../../../../components/Logo';
import { RegisterForm } from '../../../../sections/auth/register';
import GuestGuard from '../../../../guards/GuestGuard';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { University } from '../../../../../prisma/types';
import PublicApi from '../../../../../prisma/api/PublicApi';

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

// ----------------------------------------------------------------------

type RegisterProps = {
  universities: University[];
}

export default function Register({ universities }: RegisterProps) {
  return (
    <GuestGuard>
      <Page title='Register'>
        <RootStyle>
          <HeaderStyle>
            <Logo />
          </HeaderStyle>

          <Container>
            <ContentStyle>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant='h4' gutterBottom>
                    Create an account
                  </Typography>
                </Box>
                <Logo university disabledLink sx={{ width: 64, height: 64 }} />
              </Box>

              <RegisterForm universities={universities} />

              <Typography variant='body2' sx={{ mt: 3, textAlign: 'center' }}>
                Already have an account?{' '}
                <NextLink href={PATH_AUTH.login} passHref style={{ textDecoration: 'none' }}>
                  <Typography component={'span'} variant='subtitle2'>Login</Typography>
                </NextLink>
              </Typography>
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new PublicApi();
  const universities = await api.getUniversities();
  return {
    props: {
      universities,
    },
  };
};
