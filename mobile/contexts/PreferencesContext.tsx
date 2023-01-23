import { createContext, ReactNode, useState } from 'react';
import { Appearance } from "react-native";

export type PreferencesContextProps = {
  isThemeDark: boolean,
  toggleTheme: () => void,
};

const initialState: PreferencesContextProps = {
  isThemeDark: false,
  toggleTheme: () => {
  },
};

const PreferencesContext = createContext(initialState);

type PreferencesProviderProps = {
  children: ReactNode;
};

function PreferencesProvider({ children }: PreferencesProviderProps) {
  const useColorScheme = Appearance.getColorScheme();
  const [isThemeDark, setIsThemeDark] = useState<boolean>(useColorScheme === 'dark');

  Appearance.addChangeListener((preferences: { colorScheme: 'light' | 'dark' | null | undefined }) => setIsThemeDark(preferences.colorScheme === 'dark'))

  const toggleTheme = () => setIsThemeDark((prev) => !prev);

  return (
    <PreferencesContext.Provider
      value={{
        isThemeDark,
        toggleTheme
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export { PreferencesProvider, PreferencesContext };
