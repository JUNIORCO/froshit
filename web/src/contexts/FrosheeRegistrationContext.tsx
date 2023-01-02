import { ChangeEvent, createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { Frosh, University } from '../../prisma/types';
import { FrosheeRegistrationSteps } from '../components/checkout/steps';
import * as Yup from 'yup';
import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Stripe from 'stripe';
// @ts-ignore
import { stripePromise } from '../stripe';
import { useRouter } from 'next/router';

export type FormRegisterProps = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  frosh: Frosh | null;
  afterSubmit?: string;
};

export type FrosheeRegistrationContextProps = {
  university: University & { froshs: Frosh[] };
  activeStep: FrosheeRegistrationSteps;
  setActiveStep: Dispatch<SetStateAction<FrosheeRegistrationSteps>>;
  loadingPaymentIntent: boolean;
  setLoadingPaymentIntent: Dispatch<SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  methods: UseFormReturn<FormRegisterProps>;
  formPayload: FormRegisterProps;
  createCheckout: (formValues: FormRegisterProps, event: ChangeEvent<HTMLInputElement>) => void;
};

// @ts-ignore
const initialState: FrosheeRegistrationContextProps = {
  activeStep: FrosheeRegistrationSteps.PERSONAL_INFORMATION,
  setActiveStep: () => {
  },
};

const FrosheeRegistrationContext = createContext(initialState);

type SubdomainProviderProps = {
  university: University & { froshs: Frosh[] };
  children: ReactNode;
};

function FrosheeRegistrationProvider({ university, children }: SubdomainProviderProps) {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState<FrosheeRegistrationSteps>(FrosheeRegistrationSteps.PERSONAL_INFORMATION);
  const [loadingPaymentIntent, setLoadingPaymentIntent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phoneNumber: Yup.string().nullable(),
    frosh: Yup.object().required('Frosh is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: null,
    frosh: null,
  };

  const methods = useForm<FormRegisterProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const formPayload = methods.watch();

  const createCheckout = async (formValues: FormRegisterProps, event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setErrorMessage('');
    setLoadingPaymentIntent(true);

    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formPayload: formValues,
        university,
      }),
    });

    const {
      session,
      error,
    } = await res.json() as { session: Stripe.Response<Stripe.Checkout.Session> | null; error: string | null };

    setLoadingPaymentIntent(false);

    if (session?.url) void router.push(session.url);
    else if (error) setErrorMessage(error);
    else setErrorMessage('Something went wrong. Please try again later.');
  };

  return (
    <FrosheeRegistrationContext.Provider
      value={{
        university,
        activeStep,
        setActiveStep,
        loadingPaymentIntent,
        setLoadingPaymentIntent,
        errorMessage,
        setErrorMessage,
        methods,
        formPayload,
        createCheckout,
      }}
    >
      {children}
    </FrosheeRegistrationContext.Provider>
  );
}

export { FrosheeRegistrationProvider, FrosheeRegistrationContext };
