import { ValidSubdomains } from './subdomains';

type ColorObject = {
  name: string;
  contrastText: string;

  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
}

export const SUBDOMAIN_COLOR_PALETTE: Record<ValidSubdomains, ColorObject> = {
  [ValidSubdomains.demo]: {
    name: ValidSubdomains.demo,
    contrastText: '#FAF9F6',

    lighter: '#ede8fc',
    light: '#9474ec',
    main: '#4C18E0',
    dark: '#260c70',
    darker: '#080216',
  },
  // [ValidSubdomains.mcgill]: {
  //   name: ValidSubdomains.mcgill,
  //   contrastText: '#f2f2f2',
  //
  //   lighter: '#fde8ea',
  //   light: '#f68d97',
  //   main: '#ed1b2f',
  //   dark: '#770e18',
  //   darker: '#180305',
  // },
  // [ValidSubdomains.concordia]: {
  //   name: ValidSubdomains.concordia,
  //   contrastText: '#f2f2f2',
  //
  //   lighter: '#f4e9eb',
  //   light: '#c8919c',
  //   main: '#912338',
  //   dark: '#49121c',
  //   darker: '#0e0306',
  // },
};
