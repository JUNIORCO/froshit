import { createContext, ReactNode } from 'react';
import { ValidSubdomains } from "../theme/subdomains";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  Provider as PaperProvider
} from "react-native-paper";
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import usePreferences from "../hooks/usePreferences";
import { SUBDOMAIN_COLOR_PALETTE } from "../theme/subdomain-color-palette";
import { FroshitTheme } from "../theme/froshitTheme";

export type ThemeContextProps = MD3Theme;

const initialState: ThemeContextProps = MD3LightTheme;

const ThemeContext = createContext(initialState);

type PreferencesProviderProps = {
  subdomain?: ValidSubdomains;
  children: ReactNode;
};

function ThemeProvider({ subdomain, children }: PreferencesProviderProps) {
  const { isThemeDark } = usePreferences();
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const customTheme = SUBDOMAIN_COLOR_PALETTE[subdomain as ValidSubdomains] || FroshitTheme;

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
      ...customTheme.light,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
      ...customTheme.dark,
    },
  };

  const theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <ThemeContext.Provider
        value={theme}
      >
        {children}
      </ThemeContext.Provider>
    </PaperProvider>
  );
}

export { ThemeProvider, ThemeContext };
