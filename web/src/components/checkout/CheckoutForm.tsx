import React from 'react';
import { FormProvider } from '../hook-form';
import useFrosheeRegistration from '../../hooks/useFrosheeRegistration';
import { FrosheeRegistrationSteps } from './steps';
import PersonalInformation from './PersonalInformation';
import SelectFrosh from './SelectFrosh';

export default function CheckoutForm() {
  const { activeStep, methods, createCheckout } = useFrosheeRegistration();
  const { handleSubmit } = methods;

  return (
    // @ts-ignore
    <FormProvider methods={methods} onSubmit={handleSubmit(createCheckout)} >
      {activeStep === FrosheeRegistrationSteps.PERSONAL_INFORMATION && <PersonalInformation />}
      {activeStep === FrosheeRegistrationSteps.FROSH_SELECT && <SelectFrosh />}
    </FormProvider>
  );
}
