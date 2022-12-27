export enum SignInScreenNames {
  EMAIL_INPUT = 'EMAIL_INPUT',
  VERIFY_CODE = 'VERIFY_CODE'
}

export type SignInStackParamList = {
  [key in SignInScreenNames]: undefined
};
