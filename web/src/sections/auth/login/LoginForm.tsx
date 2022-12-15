import * as Yup from 'yup';
import { useState } from 'react';
// next
import NextLink from 'next/link';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Alert, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Role } from '../../../../prisma/types';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};

export default function LoginForm({ subdomain }: any) {
  const supabaseClient = useSupabaseClient();

  const [showPassword, setShowPassword] = useState(subdomain === 'demo');

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: 'froshit.business@gmail.com',
    password: 'demo1234',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (profile: FormValuesProps) => {
    const { data: dbProfile, error: dbProfileError } = await supabaseClient
      .from('profile')
      .select('email, role, university (subdomain)')
      .eq('email', profile.email)
      .single();

    if (dbProfileError || !dbProfile) {
      setError('afterSubmit', { ...dbProfileError, message: 'User not found' });
      return;
    }

    // @ts-ignore
    if (dbProfile.university.subdomain !== subdomain) {
      setError('afterSubmit', { message: 'User does not belong to this university' });
      return;
    }

    if (![Role.Admin, Role.Organizer].includes(dbProfile.role)) {
      setError('afterSubmit', { message: 'User is not an Admin or Organizer' });
      return;
    }

    const { data: createdProfile, error: createdProfileError } = await supabaseClient
      .auth
      .signInWithPassword({
        email: profile.email,
        password: profile.password,
      });

    if (createdProfileError || !createdProfile) {
      console.error(createdProfileError);
      setError('afterSubmit', { message: 'Failed to login' });
      return;
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}

        <RHFTextField name='email' label='Email address' />

        <RHFTextField
          name='password'
          label='Password'
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size='large'
        type='submit'
        variant='contained'
        loading={isSubmitting}
        sx={{ my: 2 }}
      >
        Sign in
      </LoadingButton>

      <Typography variant='body2' align='center'>
        <NextLink href={PATH_AUTH.resetPassword} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
          Forgot password?
        </NextLink>
      </Typography>

    </FormProvider>
  );
}
