import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

export type SignInContextProps = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  resetSignInFields: VoidFunction;
};

const initialState: SignInContextProps = {
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
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  const resetSignInFields = () => {
    setEmail('');
    setOtp('');
  }

  return (
    <SignInContext.Provider
      value={{
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
