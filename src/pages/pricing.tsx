// @mui
import { styled } from '@mui/material/styles';
import { Box, Grid, Switch, Container, Typography, Stack } from '@mui/material';
// _mock_
import { _pricingPlans } from '../_mock';
// layouts
import Layout from '../layouts';
// components
import Page from '../components/Page';
// sections
import { PricingPlanCard } from '../sections/pricing';
import { m } from 'framer-motion';
import { varFade } from '../components/animate';
import { PlanCard } from '../components/Pricing';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

Pricing.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Pricing() {
  return (
    <Page title="Pricing">
      <RootStyle>
        <Container>
          <Typography variant="h3" align="center" paragraph>
            One Price
            <br />
            No Extras
          </Typography>

          <Typography align="center" sx={{ color: 'text.secondary' }}>
            Clear and flexible pricing ensures you only pay for the amount of users your application uses.
          </Typography>

          <Box sx={{ mb: 1 }} />

          <Grid container spacing={5} sx={{ justifyContent: 'center' }}>
            <Grid item xs={12} md={4}>
              <m.div
                variants={varFade().inDown}
              >
                <PlanCard />
              </m.div>
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}
