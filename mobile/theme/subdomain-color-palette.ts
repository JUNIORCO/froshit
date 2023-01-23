import { ValidSubdomains } from './subdomains';

type ColorObject = {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  // tertiary: string;
  // tertiaryContainer: string;
}

export const SUBDOMAIN_COLOR_PALETTE: Record<ValidSubdomains, ColorObject> = {
  [ValidSubdomains.demo]: {
    primary: '#5D5EE2',
    primaryContainer: '#b19bfa',
    secondary: '#b19bfa',
    secondaryContainer: 'white',
    // tertiary: palette.tertiary40,
    // tertiaryContainer: palette.tertiary90,
  },
};
