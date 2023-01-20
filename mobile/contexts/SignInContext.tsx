import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { SignInSteps } from "../components/auth/steps";

export type SignInContextProps = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  step: SignInSteps;
  setStep: Dispatch<SetStateAction<SignInSteps>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  resetSignInFields: VoidFunction;
};

const initialState: SignInContextProps = {
  loading: false,
  setLoading: () => {
  },
  step: SignInSteps.EMAIL_INPUT,
  setStep: () => {
  },
  error: '',
  setError: () => {
  },
  email: '',
  setEmail: () => {
  },
  otp: '',
  setOtp: () => {
  },
  resetSignInFields: () => {
  },
};

const SignInContext = createContext(initialState);

type SignInProviderProps = {
  children: ReactNode;
};

function SignInProvider({ children }: SignInProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<SignInSteps>(SignInSteps.EMAIL_INPUT);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  const resetSignInFields = () => {
    setEmail('');
    setOtp('');
  }

  useEffect(() => {
    setError('');
  }, [step, email, otp]);

  return (
    <SignInContext.Provider
      value={{
        loading,
        setLoading,
        step,
        setStep,
        error,
        setError,
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
