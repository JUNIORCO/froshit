import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IconButton, InputAdornment, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

type FormValuesProps = {
  password: string;
  confirmPassword: string;
};

type Props = {
  email: string;
}

export default function SetPasswordForm({ email: userEmail }: Props) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const supabaseClient = useSupabaseClient();

  const [showPassword, setShowPassword] = useState(false);

  const VerifyCodeSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const defaultValues = {
    email: userEmail,
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const { error } = await supabaseClient.auth.updateUser({ password: data.password });

    if (error) {
      enqueueSnackbar('Something went wrong...', { variant: 'error' });
      return;
    }

    enqueueSnackbar('Password set');
    void push(PATH_DASHBOARD.root);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name='email' label='Email' disabled />

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

        <RHFTextField
          name='confirmPassword'
          label='Confirm New Password'
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

        <LoadingButton
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          loading={isSubmitting}
          sx={{ mt: 3 }}
        >
          Change password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
