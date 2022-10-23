import { m } from 'framer-motion';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, Card, Container, Divider, Grid, Link, Stack, Typography } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import { MotionViewport, varFade } from '../../components/animate';
//icons
import documentVertical from '@iconify/icons-carbon/document-vertical';
import money from '@iconify/icons-carbon/money';
import applicationWeb from '@iconify/icons-carbon/application-web';
import applicationMobile from '@iconify/icons-carbon/application-mobile';
import { PlanCard } from '../../components/Pricing';
import { PATH_PAGE } from '../../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

// ----------------------------------------------------------------------

export default function HomePricingPlans() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle>
      <Container component={MotionViewport}>
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <m.div variants={varFade().inUp}>
            <Typography component='div' variant='overline' sx={{ mb: 2, color: 'text.disabled' }}>
              Pricing
            </Typography>
          </m.div>
          <m.div variants={varFade().inDown}>
            <Typography variant='h2' sx={{ mb: 3 }}>
              One Price <br /> No Extras
            </Typography>
          </m.div>
          <m.div variants={varFade().inDown}>
            <Typography
              sx={{
                color: isLight ? 'text.secondary' : 'text.primary',
              }}
            >
              Clear and flexible pricing ensures you only pay for the amount of users your application uses.
            </Typography>
          </m.div>
        </Box>

        <Grid container spacing={5} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} md={4}>
            <m.div
              variants={varFade().inDown}
            >
              <PlanCard />
            </m.div>
          </Grid>
        </Grid>

        <m.div variants={varFade().in}>
          <Box sx={{ p: 5, mt: 10, textAlign: 'center' }}>
            <m.div variants={varFade().inDown}>
              <Typography variant='h3'>Still have questions?</Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
              <Typography sx={{ mt: 3, mb: 5, color: 'text.secondary' }}>
                Check out our Support page for frequently asked questions.
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Button
                size='large'
                variant='contained'
                href={PATH_PAGE.support}
              >
                Support
              </Button>
            </m.div>
          </Box>
        </m.div>
      </Container>
    </RootStyle>
  );
}
