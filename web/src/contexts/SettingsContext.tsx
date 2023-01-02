import Cookies from 'js-cookie';
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import getColorPresets, { colorPresets, defaultPreset } from '../utils/getColorPresets';
import { cookiesExpires, cookiesKey, defaultSettings } from '../config';
import { SettingsContextProps, SettingsValueProps } from '../components/settings/type';

const initialState: SettingsContextProps = {
  ...defaultSettings,
  onToggleMode: () => {},
  setColor: defaultPreset,
  colorOption: [],
};

const SettingsContext = createContext(initialState);

type SettingsProviderProps = {
  children: ReactNode;
  defaultSettings: SettingsValueProps;
};

function SettingsProvider({ children, defaultSettings }: SettingsProviderProps) {
  const [settings, setSettings] = useSettingCookies(defaultSettings);

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,

        onToggleMode,

        setColor: getColorPresets(settings.themeColorPresets),
        colorOption: colorPresets.map((color) => ({
          name: color.name,
          value: color.main,
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
