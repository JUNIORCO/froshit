import { forwardRef } from 'react';
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<any, Props>(({ disabledLink = false, sx }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = (
    <Box
      component="img"
      src="https://firebasestorage.googleapis.com/v0/b/froshit-prod.appspot.com/o/logos%2Fhigh-res-transparent.svg?alt=media&token=1244df09-d721-41b3-86bb-e4a0f5929b6d"
      sx={{ width: 50, height: 50, cursor: 'pointer', ...sx }}
    />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <NextLink href="/" style={{ textDecoration: 'none' }}>{logo}</NextLink>;
});

export default Logo;
