import { ValidSubdomains } from './subdomains';
import { MD3Colors } from "react-native-paper/src/types";

type ColorObject = Partial<MD3Colors>;

export type CustomTheme = {
  light: ColorObject;
  dark: ColorObject;
}

export const SUBDOMAIN_COLOR_PALETTE: Record<ValidSubdomains, CustomTheme> = {
  [ValidSubdomains.demo]: {
    light: {
      primary: '#5D5EE2',
      primaryContainer: '#b19bfa',
      secondary: '#b19bfa',
      secondaryContainer: 'white',
      onPrimary: 'black',
    },
    dark: {
      primary: '#5D5EE2',
      primaryContainer: '#b19bfa',
      secondary: '#b19bfa',
      secondaryContainer: 'white',
      onPrimary: 'white',
    },
  },
  [ValidSubdomains.mcgill]: {
    light: {
      primary: '#ed1b2f',
      primaryContainer: '#fde8ea',
      secondary: '#770e18',
      secondaryContainer: 'white',
      onPrimary: 'black',
    },
    dark: {
      primary: '#ed1b2f',
      primaryContainer: '#fde8ea',
      secondary: '#770e18',
      secondaryContainer: 'black',
      onPrimary: 'white',
    },
  },
  [ValidSubdomains.queens]: {
    light: {
      primary: '#002452',
      primaryContainer: '#8092a9',
      secondary: '#fabd0f',
      secondaryContainer: '#fdde87',
      onPrimaryContainer: 'white',
    },
    dark: {
      primary: '#b90e31',
      primaryContainer: '#ce566f',
      secondary: '#002452',
      secondaryContainer: '#8092a9',
      onPrimary: 'white',
    },
  },
};
