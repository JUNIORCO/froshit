import { ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import Layout from '../layouts';
import useCountdown from '../hooks/useCountdown';
import Image from '../components/Image';
import Page from '../components/Page';

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: theme.spacing(15, 2.5),
  [theme.breakpoints.up('sm')]: {
    height: '100vh',
  },
}));

const CountdownStyle = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const SeparatorStyle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(0, 2.5),
  },
}));

export default function PrivacyPolicyPage() {
  const countdown = useCountdown(new Date('01/01/2023 00:00'));

  return (
    <Page title='Privacy Policy'>
      <RootStyle>
        <Stack alignItems='center' sx={{ maxWidth: 480 }}>
          <Typography variant='h3' paragraph>
            Privacy Policy
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            We are currently working on this page.
          </Typography>

          <Image
            alt='comingsoon'
            src='https://zone-assets-api.vercel.app/assets/illustrations/illustration_comingsoon.svg'
            sx={{ my: 3, maxWidth: 320 }}
          />

          <CountdownStyle>
            {TimeBox(countdown.days, 'Days')}
            <SeparatorStyle variant='h2'>:</SeparatorStyle>
            {TimeBox(countdown.hours, 'Hours')}
            <SeparatorStyle variant='h2'>:</SeparatorStyle>
            {TimeBox(countdown.minutes, 'Minutes')}
            <SeparatorStyle variant='h2'>:</SeparatorStyle>
            {TimeBox(countdown.seconds, 'Seconds')}
          </CountdownStyle>
        </Stack>
      </RootStyle>
    </Page>
  );
}

PrivacyPolicyPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout variant="main">
      {page}
    </Layout>
  );
};

function TimeBox(type: string, label: string) {
  return (
    <div>
      <Typography variant='h2'>{type}</Typography>
      <Typography sx={{ color: 'text.secondary' }}>{label}</Typography>
    </div>
  );
}
