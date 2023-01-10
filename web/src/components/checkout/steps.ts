export const FrosheeRegistrationSteps = {
  PERSONAL_INFORMATION: 'PERSONAL_INFORMATION',
  PROGRAM_AND_INTERESTS: 'PROGRAM_AND_INTERESTS',
  FROSH_SELECT: 'FROSH_SELECT',
};

export type FrosheeRegistrationSteps = (typeof FrosheeRegistrationSteps)[keyof typeof FrosheeRegistrationSteps]
