import { m } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import Layout from '../layouts';
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
import { PageNotFoundIllustration } from '../assets';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

Page404.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout is404>{page}</Layout>;
};

export default function Page404() {
  return (
    <Page title='404 Page Not Found'>
      <Container component={MotionContainer}>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant='h3' paragraph>
              Page not found
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>
        </ContentStyle>
      </Container>
    </Page>
  );
}
