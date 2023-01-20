import React from 'react';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { Appearance } from 'react-native'

export function ThemeProvider({ children }: any) {
  const theme = extendTheme({
    colors: {
      primary: {
        "50": "#cebffe",
        "100": "#b19bfa",
        "200": "#967af3",
        "300": "#7c5beb",
        "400": "#6039e6",
        "500": "#532adc",
        "600": "#4d29c6",
        "700": "#492bac",
        "800": "#442c93",
        "900": "#3e2c7c"
      },
    },
    // config: {
    //   initialColorMode: Appearance.getColorScheme(),
    // },
  });

  return (
    <NativeBaseProvider theme={theme}>
      {children}
    </NativeBaseProvider>
  );
}
