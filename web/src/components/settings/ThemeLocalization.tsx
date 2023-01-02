import { ReactNode } from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import useLocales from '../../hooks/useLocales';

type Props = {
  children: ReactNode;
};

export default function ThemeLocalization({ children }: Props) {
  const defaultTheme = useTheme();

  const { currentLang } = useLocales();

  const theme = createTheme(defaultTheme, currentLang.systemValue);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
