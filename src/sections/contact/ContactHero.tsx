// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Grid, Typography } from '@mui/material';
//
import { MotionContainer, varFade } from '../../components/animate';
import { m } from 'framer-motion';
import { FROSHIT_EMAIL, FROSHIT_PHONE } from '../../config';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage:
    'url(/assets/overlay.svg), url(https://minimal-assets-api-dev.vercel.app/assets/images/contact/hero.jpg)',
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    height: 560,
    padding: 0,
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    position: 'absolute',
    bottom: theme.spacing(10),
  },
}));

// ----------------------------------------------------------------------

export default function ContactHero() {
  return (
    <RootStyle>
      <Container component={MotionContainer} sx={{ position: 'relative', height: '100%' }}>
        <ContentStyle sx={{ pb: 5 }}>
          <Box sx={{ display: 'inline-flex', color: 'common.white' }}>
            <m.div variants={varFade().inRight}>
              <Typography variant='h1'>To set up an account</Typography>
            </m.div>
          </Box>
          <Box sx={{ display: 'inline-flex', color: 'common.white', pt: 3 }}>
            <m.div variants={varFade().inRight}>
              <Typography variant='h3'>Get in touch with us by phone or e-mail</Typography>
            </m.div>
          </Box>

          <Grid container spacing={5} sx={{ mt: 5, color: 'common.white' }}>
            <Grid item xs={12} sm={6} md={3} lg={2} sx={{ pr: { md: 5 } }}>
              <m.div variants={varFade().inRight}>
                <Typography variant='body1'>
                  {FROSHIT_EMAIL}
                  <br /> {FROSHIT_PHONE}
                </Typography>
              </m.div>
            </Grid>
          </Grid>

        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
