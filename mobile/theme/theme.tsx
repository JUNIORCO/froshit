import type { ReactElement } from 'react';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider, } from 'react-native-paper';
import { ValidSubdomains } from "./subdomains";
import { SUBDOMAIN_COLOR_PALETTE } from "./subdomain-color-palette";

type Props = {
  subdomain?: ValidSubdomains;

  children: ReactElement;
}

export function ThemeProvider({ subdomain, children }: Props) {
  const palette = SUBDOMAIN_COLOR_PALETTE[subdomain as ValidSubdomains || 'demo'];

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...palette,
    }
  };

  return (
    <PaperProvider theme={theme}>
      {children}
    </PaperProvider>
  );
}
