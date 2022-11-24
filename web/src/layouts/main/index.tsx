import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import MainFooter from './MainFooter';
import MainHeader from './MainHeader';

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <Stack sx={{ minHeight: 1 }}>
      <MainHeader />

      {children}

      <Box sx={{ flexGrow: 1 }} />

      <MainFooter />

    </Stack>
  );
}
