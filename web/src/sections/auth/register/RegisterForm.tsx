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
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Role, University } from '../../../../prisma/types';
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

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

type RegisterProps = {
  universities: University[];
}

export default function RegisterForm({ universities }: RegisterProps) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const supabaseClient = useSupabaseClient();
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
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '',
    universityId: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const { data: signedUpUser, error } = await supabaseClient.auth.signUp({
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

    if (error) {
      enqueueSnackbar(`Error ${error.message}`, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Successfully registered!');
    void push(PATH_AUTH.login);
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

        <RHFTextField name='phoneNumber' label='Phone Number' />

        <RHFSelect name='role' label='Role' placeholder='Role'>
          <option value='' />
          {Object.values(Role).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </RHFSelect>

        <RHFSelect name='universityId' label='University' placeholder='University'>
          <option value='' />
          {universities.map((university) => (
            <option key={university.id} value={university.id}>
              {university.name}
            </option>
          ))}
        </RHFSelect>

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
