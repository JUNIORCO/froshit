import type { ReactElement } from 'react';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { ValidSubdomains } from "./subdomains";
import { SUBDOMAIN_COLOR_PALETTE } from "./subdomain-color-palette";

type Props = {
  subdomain?: ValidSubdomains;

  children: ReactElement;
}

export function ThemeProvider({ subdomain, children }: Props) {

  const froshitColors = {
    "50": "#cebffe",
    "100": "#b19bfa",
    "200": "#967af3",
    "300": "#7c5beb",
    "400": "#6039e6",
    "500": "#532adc",
    "600": "#4d29c6",
    "700": "#492bac",
    "800": "#442c93",
    "900": "#3e2c7c",
  }

  // const theme = extendTheme({
  //   colors: {
  //     primary: subdomain ? SUBDOMAIN_COLOR_PALETTE[subdomain] : froshitColors,
  //   },
  // });

  const theme = {
    ...DefaultTheme,
  };

  return (
    <PaperProvider theme={theme}>
      {children}
    </PaperProvider>
  );
}
