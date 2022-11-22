import { Box, Card, Container, Grid, Slider, Stack, TextField, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Frosh } from '../../../../../../../prisma/types';
import { Query } from '../../../../../../@types/query';
import AuthApi from '../../../../../../../prisma/api/AuthApi';

FroshView.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  frosh: Frosh;
}

export default function FroshView({ frosh }: Props) {
  const { name, description, ticketPrice } = frosh;
  const { themeStretch } = useSettings();

  const marksLabel = [...Array(21)].map((_, index) => {
    const value = index * 10;

    return {
      value,
      label: index % 2 ? '' : `$${value}`,
    };
  });

  return (
    <Page title='View Frosh'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Frosh'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Frosh', href: PATH_DASHBOARD.frosh.root },
            { name: 'View' },
          ]}
        />

        <Box sx={{ mb: 5 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <TextField disabled value={name} label='Name' />

                <TextField disabled value={description} label='Description' />

                <Stack spacing={1} sx={{ pb: 2 }}>

                  <Typography variant='subtitle1' sx={{ flexGrow: 1 }}>
                    Ticket Price
                  </Typography>
                  <Slider
                    disabled
                    value={ticketPrice}
                    step={5}
                    min={0}
                    max={200}
                    marks={marksLabel}
                    getAriaValueText={(value) => `$${value}`}
                    valueLabelFormat={(value) => `$${value}`}
                    sx={{ alignSelf: 'center', width: `calc(100% - 20px)` }}
                    valueLabelDisplay='auto'
                  />
                </Stack>
              </Box>

            </Card>
          </Grid>
        </Grid>

      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { subdomain, id } = ctx.query as Query;
  const api = new AuthApi({ ctx });
  const frosh = await api.Frosh.getFroshById(id);

  return {
    props: {
      frosh,
    },
  };
};
