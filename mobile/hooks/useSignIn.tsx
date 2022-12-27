import { useContext } from 'react';
import { SignInContext } from '../contexts/SignInContext';

const useSignIn = () => useContext(SignInContext);

export default useSignIn;
