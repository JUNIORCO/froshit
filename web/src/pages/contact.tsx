import { styled } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
import Layout from '../layouts';
import Page from '../components/Page';
import { ContactForm, ContactHero } from '../sections/contact';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------

Contact.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant='main'>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Contact() {
  return (
    <Page title='Contact us'>
      <RootStyle>
        <ContactHero />

        <Container sx={{ my: 10 }}>
          <Grid container spacing={10}>
            <Grid item xs={12} md={6}>
              <ContactForm />
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}
