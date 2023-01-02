import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Stack, StackProps, Typography } from '@mui/material';
// routes
import { PATH_PAGE } from '../../routes/paths';
// components
import Iconify from '../../components/Iconify';
import { MotionContainer, varFade } from '../../components/animate';
import useResponsive from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[400],
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',
  },
}));

const ContentStyle = styled((props: StackProps) => <Stack spacing={5} {...props} />)(
  ({ theme }) => ({
    zIndex: 10,
    maxWidth: 520,
    margin: 'auto',
    textAlign: 'center',
    position: 'relative',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
      margin: 'unset',
      textAlign: 'left',
    },
  }),
);

const HeroOverlayStyle = styled(m.img)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const HeroImgStyle = styled(m.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: '100%',
  margin: 'auto',
  position: 'absolute',
  [theme.breakpoints.up('lg')]: {
    right: '8%',
    width: 'auto',
    height: '48vh',
  },
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const isDesktop = useResponsive('up', 'sm');

  return (
    <MotionContainer>
      <RootStyle>
        <HeroOverlayStyle alt='overlay' src='/assets/overlay.svg' variants={varFade().in} />

        <HeroImgStyle
          alt='hero'
          src='https://minimal-assets-api-dev.vercel.app/assets/images/home/hero.png'
          variants={varFade().inUp}
        />

        <Container>
          <ContentStyle>
            <m.div variants={varFade().inRight}>
              <Typography variant='h1' sx={{ color: 'common.white' }}>
                Streamline <br />
                Your Frosh <br />
                Operations With
                <Typography component='span' variant='h1' sx={{ color: 'primary.main' }}>
                  &nbsp;FROSHIT
                </Typography>
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Typography sx={{ color: 'common.white' }}>
                The FROSHIT platform makes it easy to register students, receive payment, and organize Frosh.
              </Typography>
            </m.div>

            {isDesktop ? (
              <m.div variants={varFade().inRight}>
                <a href={PATH_PAGE.contact} style={{ textDecoration: 'none' }}>
                  <Button
                    size='large'
                    variant='contained'
                    startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}
                  >
                    Get Started
                  </Button>
                </a>
              </m.div>
            ) : null}

          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </MotionContainer>
  );
}
