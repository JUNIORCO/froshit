import Cookies from 'js-cookie';
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import getColorPresets, { defaultPreset } from '../utils/getColorPresets';
import { cookiesExpires, cookiesKey, defaultSettings } from '../config';
import { SettingsContextProps, SettingsValueProps } from '../components/settings/type';
import { SUBDOMAIN_COLOR_PALETTE } from '../hardcoded/subdomain-color-palette';
import { ValidSubdomains } from '../hardcoded/subdomains';
import useSubdomain from '../hooks/useSubdomain';

const initialState: SettingsContextProps = {
  ...defaultSettings,
  onToggleMode: () => {},
  setColorPalette: () => {},
  setColor: defaultPreset,
  colorOption: [],
};

const SettingsContext = createContext(initialState);

type SettingsProviderProps = {
  children: ReactNode;
  defaultSettings: SettingsValueProps;
};

function SettingsProvider({ children, defaultSettings }: SettingsProviderProps) {
  const { subdomain } = useSubdomain();
  const [settings, setSettings] = useSettingCookies(defaultSettings);

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  const setColorPalette = (color: ValidSubdomains) => {
    setSettings({
      ...settings,
      themeColorPresets: color,
    });
  };

  useEffect(() => {
    console.log('subdomain : ', subdomain);
    setColorPalette(subdomain ? subdomain as ValidSubdomains : ValidSubdomains.demo);
  }, [subdomain]);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,

        onToggleMode,
        setColorPalette,

        setColor: getColorPresets(settings.themeColorPresets) || SUBDOMAIN_COLOR_PALETTE.demo,
        colorOption: Object.entries(SUBDOMAIN_COLOR_PALETTE).map(([key, value]) => ({
          name: key,
          value: value.main,
        })),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };

function useSettingCookies(
  defaultSettings: SettingsValueProps,
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);

  const onChangeSetting = () => {
    Cookies.set(cookiesKey.themeMode, settings.themeMode, { expires: cookiesExpires });

    Cookies.set(cookiesKey.themeColorPresets, settings.themeColorPresets, {
      expires: cookiesExpires,
    });
  };

  useEffect(() => {
    onChangeSetting();
  }, [settings]);

  return [settings, setSettings];
}
