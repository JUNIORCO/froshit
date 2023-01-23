import { ValidSubdomains } from './subdomains';

type ColorObject = {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
}

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
    },
    dark: {
      primary: '#5D5EE2',
      primaryContainer: '#b19bfa',
      secondary: '#b19bfa',
      secondaryContainer: 'white',
    },
  },
};
