import { ValidSubdomains } from './subdomains';

type ColorObject = {
  "50": string;
  "100": string;
  "200": string;
  "300": string;
  "400": string;
  "500": string;
  "600": string;
  "700": string;
  "800": string;
  "900": string;
}

export const SUBDOMAIN_COLOR_PALETTE: Record<ValidSubdomains, ColorObject> = {
  [ValidSubdomains.demo]: {
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
  },
};
