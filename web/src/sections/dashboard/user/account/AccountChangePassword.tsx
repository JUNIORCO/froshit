import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Card, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

type FormValuesProps = {
  newPassword: string;
  confirmNewPassword: string;
};

export default function AccountChangePassword() {
  const supabaseClient = useSupabaseClient();
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const defaultValues = {
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const { error } = await supabaseClient.auth.updateUser({ password: data.confirmNewPassword });
      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }

      reset();
      enqueueSnackbar('Updated password');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3, width: '50%' }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems='flex-end'>
          <RHFTextField name='newPassword' type='password' label='New Password' />

          <RHFTextField name='confirmNewPassword' type='password' label='Confirm New Password' />

          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
