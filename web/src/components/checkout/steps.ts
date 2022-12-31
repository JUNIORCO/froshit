export const FrosheeRegistrationSteps = {
  PERSONAL_INFORMATION: 'PERSONAL_INFORMATION',
  FROSH_SELECT: 'FROSH_SELECT',
};

export type FrosheeRegistrationSteps = (typeof FrosheeRegistrationSteps)[keyof typeof FrosheeRegistrationSteps]
