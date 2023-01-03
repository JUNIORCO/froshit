import { ValidSubdomains } from '../../hardcoded/subdomains';

type ColorVariants = {
  name: string;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
};

export type ThemeMode = 'light' | 'dark';
export type ThemeColorPresets = ValidSubdomains;

export type SettingsValueProps = {
  themeMode: ThemeMode;
  themeColorPresets: ThemeColorPresets;
};

export type SettingsContextProps = {
  themeMode: ThemeMode;
  themeColorPresets: ThemeColorPresets;
  setColor: ColorVariants;
  colorOption: {
    name: string;
    value: string;
  }[];

  // Mode
  onToggleMode: VoidFunction;

  setColorPalette: VoidFunction;
};
