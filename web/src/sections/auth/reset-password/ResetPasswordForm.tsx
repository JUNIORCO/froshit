import * as Yup from 'yup';
// next
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { getSubdomainUrl } from '../../../utils/url';
import { isEqual } from 'lodash';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
};

export default function ResetPasswordForm({ subdomain }: { subdomain: string }) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const supabaseClient = useSupabaseClient();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const redirectTo = getSubdomainUrl({ subdomain, path: PATH_AUTH.newPassword });
    const { error } = await supabaseClient.auth.resetPasswordForEmail(data.email, { redirectTo });

    if (error) {
      enqueueSnackbar('Error occurred!', { variant: 'error' });
      return;
    }

    enqueueSnackbar('Password reset');
    push(PATH_DASHBOARD.team.root);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name='email' label='Email address' />

        <LoadingButton
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          loading={isSubmitting}
          disabled={!isValid}
        >
          Send Request
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
