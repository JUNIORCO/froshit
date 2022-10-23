import { m } from 'framer-motion';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, Container, Grid, Typography } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionViewport, varFade } from '../../components/animate';
// icons
import devicesIcon from '@iconify/icons-carbon/devices';
import headsetIcon from '@iconify/icons-carbon/headset';
import serverTime from '@iconify/icons-carbon/server-time';
import applicationWeb from '@iconify/icons-carbon/application-web';
import applicationMobile from '@iconify/icons-carbon/application-mobile';
import money from '@iconify/icons-carbon/money';
import settingsAdjust from '@iconify/icons-carbon/settings-adjust';
import documentVertical from '@iconify/icons-carbon/document-vertical';
import security from '@iconify/icons-carbon/security';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(24, 0),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  marginBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    marginBottom: 0,
  },
}));

const ScreenStyle = styled(m.div)(({ theme }) => ({
  paddingRight: 2,
  paddingBottom: 1,
  maxWidth: 160,
  borderRadius: 8,
  backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
  [theme.breakpoints.up('sm')]: {
    maxWidth: 320,
    paddingRight: 4,
    borderRadius: 12,
  },
  '& img': {
    borderRadius: 8,
    [theme.breakpoints.up('sm')]: {
      borderRadius: 12,
    },
  },
}));

const COMMON = {
  scaleX: 0.86,
  skewY: 8,
  skewX: 0,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  opacity: 0,
};

const variantScreenLeft = {
  initial: COMMON,
  animate: { ...COMMON, translateX: '-50%', translateY: 40, opacity: 1 },
};

const variantScreenCenter = {
  initial: COMMON,
  animate: { ...COMMON, opacity: 1 },
};

const variantScreenRight = {
  initial: COMMON,
  animate: { ...COMMON, translateX: '50%', translateY: -40, opacity: 1 },
};

// ----------------------------------------------------------------------

const FEATURE_HIGHLIGHTS = [
  { title: 'Registration', icon: <Iconify icon={documentVertical} /> },
  { title: 'Payment', icon: <Iconify icon={money} /> },
  { title: 'Admin Panel', icon: <Iconify icon={applicationWeb} /> },
  { title: 'iOS & Android App', icon: <Iconify icon={applicationMobile} /> },
  { title: 'Realtime', icon: <Iconify icon={devicesIcon} /> },
  { title: 'No Downtime', icon: <Iconify icon={serverTime} /> },
  { title: 'Secure', icon: <Iconify icon={security} /> },
  { title: 'Easy to Customize', icon: <Iconify icon={settingsAdjust} /> },
  { title: 'Fast Support', icon: <Iconify icon={headsetIcon} /> },
];

// ----------------------------------------------------------------------

export default function HomeHugePackElements() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const isRTL = theme.direction === 'rtl';

  const screenLeftAnimate = variantScreenLeft;

  const screenCenterAnimate = variantScreenCenter;

  const screenRightAnimate = variantScreenRight;

  return (
    <MotionViewport disableAnimatedMobile={false}>
      <RootStyle>
        <Container>
          <Grid container spacing={5} justifyContent='center'>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <ContentStyle>
                <m.div variants={varFade().inUp}>
                  <Typography
                    component='div'
                    variant='overline'
                    sx={{ mb: 2, color: 'text.disabled' }}
                  >
                    Features
                  </Typography>
                </m.div>

                <m.div variants={varFade().inUp}>
                  <Typography variant='h2' sx={{ mb: 3 }}>
                    Organize with <br />
                    confidence
                  </Typography>
                </m.div>

                <m.div variants={varFade().inUp}>
                  <Typography
                    sx={{
                      mb: 5,
                      color: isLight ? 'text.secondary' : 'common.white',
                    }}
                  >
                    A variety of features to deliver the best Frosh experience for you and your students.
                  </Typography>
                </m.div>

              </ContentStyle>
            </Grid>

            <Grid item xs={12} md={8} dir='ltr'>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 3,
                  rowGap: 6,
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                }}
              >
                {FEATURE_HIGHLIGHTS.map((feature) => (
                  <m.div key={feature.title} variants={varFade({ distance: 40 }).inUp}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        '& > svg': { width: 32, height: 32 },
                      }}
                    >
                      {feature.icon}
                      <Typography
                        variant='subtitle2'
                        component='h5'
                        sx={{ mt: 2, fontWeight: 'fontWeightMedium' }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                  </m.div>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
    </MotionViewport>
  );
}
