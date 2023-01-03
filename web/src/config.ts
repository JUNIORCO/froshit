import { enUS, frFR } from '@mui/material/locale';
import { SettingsValueProps } from './components/settings/type';
import { PATH_DASHBOARD } from './routes/paths';
import type { Theme } from '@mui/material';
import { ValidSubdomains } from './hardcoded/subdomains';

export const FROSHIT_EMAIL = 'froshit.business@gmail.com';
export const FROSHIT_ADDRESS = '88 Harbour St, Toronto, Ontario';
export const FROSHIT_PHONE = '(437) 987 6231';
export const FROSHIT_LINKEDIN = 'https://linkedin.com';
export const FROSHIT_INSTAGRAM = 'https://instagram.com';

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.app;

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  MOBILE_HEIGHT: 64,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 92,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
};

export const NAVBAR = {
  DASHBOARD_WIDTH: 240,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
};

export const ICON = {
  NAVBAR_ITEM: 22,
};

// SETTINGS
// ----------------------------------------------------------------------

export const cookiesExpires = 3;

export const cookiesKey = {
  themeMode: 'themeMode',
  themeColorPresets: 'themeColorPresets',
};

export const defaultSettings: SettingsValueProps = {
  themeMode: 'light',
  themeColorPresets: ValidSubdomains.demo,
};

// MULTI LANGUAGES

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
  },
  {
    label: 'French',
    value: 'fr',
    systemValue: frFR,
  },
];

export const defaultLang = allLangs[0]; // English

export const getAnalysisColors = (theme: Theme) => [
  theme.palette.primary.main,
  theme.palette.chart.blue[0],
  theme.palette.chart.violet[0],
  '#3ed930',
  '#30d9b2',
  '#ac30d9',
  '#2f2fd6',
  '#eba534',
  '#eb3468',
];
