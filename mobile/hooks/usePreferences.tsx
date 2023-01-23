import { useContext } from 'react';
import { PreferencesContext } from "../contexts/PreferencesContext";

const usePreferences = () => useContext(PreferencesContext);

export default usePreferences;
