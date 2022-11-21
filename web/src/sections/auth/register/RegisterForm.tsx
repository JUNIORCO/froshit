import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Alert, IconButton, InputAdornment, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  universityId: string;
  afterSubmit?: string;
};

export default function RegisterForm() {
  const supabaseClient = useSupabaseClient();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    phoneNumber: Yup.string().required('Phone number required'),
    role: Yup.string().required('Role required'),
    universityId: Yup.string().required('University id required'),
  });

  const defaultValues = {
    email: 'j@gmail.com',
    password: 'Demo1234',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234',
    role: 'Admin',
    universityId: '1678f7bf-7a13-477c-942c-c85dcadfdd40',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,

    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const res = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            role: data.role,
            universityId: data.universityId,
          },
        },
      });
    } catch (error) {
      reset();

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name='firstName' label='First name' />
          <RHFTextField name='lastName' label='Last name' />
        </Stack>

        <RHFTextField name='email' label='Email address' />

        <RHFTextField
          name='password'
          label='Password'
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          loading={isSubmitting}
        >
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
