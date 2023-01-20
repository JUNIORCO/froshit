export const SignInSteps = {
  EMAIL_INPUT: 'EMAIL_INPUT',
  VERIFY_OTP: 'VERIFY_OTP',
};

export type SignInSteps = (typeof SignInSteps)[keyof typeof SignInSteps];
