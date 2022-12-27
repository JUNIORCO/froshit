import { createContext, Dispatch, LegacyRef, ReactNode, SetStateAction, useRef, useState } from 'react';
import SelectDropdown from "react-native-select-dropdown";

export type SignInContextProps = {
  dropdownRef: LegacyRef<SelectDropdown | undefined>;
  selectedUniversityId: string;
  setSelectedUniversityId: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  resetSignInFields: VoidFunction;
};

const initialState: SignInContextProps = {
  dropdownRef: { current: undefined },
  selectedUniversityId: '',
  setSelectedUniversityId: () => {},
  email: '',
  setEmail: () => {},
  otp: '',
  setOtp: () => {},
  resetSignInFields: () => {},
};

const SignInContext = createContext(initialState);

type SignInProviderProps = {
  children: ReactNode;
};

function SignInProvider({ children }: SignInProviderProps) {
  const dropdownRef = useRef<SelectDropdown | undefined>();
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  const resetSignInFields = () => {
    dropdownRef.current?.reset();
    setSelectedUniversityId('');
    setEmail('');
    setOtp('');
  }

  return (
    <SignInContext.Provider
      value={{
        dropdownRef,
        selectedUniversityId,
        setSelectedUniversityId,
        email,
        setEmail,
        otp,
        setOtp,
        resetSignInFields,
      }}
    >
      {children}
    </SignInContext.Provider>
  );
}

export { SignInProvider, SignInContext };
