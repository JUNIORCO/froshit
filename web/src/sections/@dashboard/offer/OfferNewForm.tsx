import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { v4 as uuid } from 'uuid';
import useProfile from '../../../hooks/useProfile';

type FormValuesProps = {
  name: string;
  description: string;
};

export default function OfferNewForm() {
  const { profile } = useProfile();
  const supabaseClient = useSupabaseClient();

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewOfferSchema = Yup.object().shape({
    title: Yup.string().required('Frosh title is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.string().required('Location is required'),
    provider: Yup.string().required('Ticket price is required'),
    icon: Yup.string().required('Ticket price is required'),
    color: Yup.string().required('Ticket price is required'),
    universityId: Yup.string().required(),
  });

  const defaultValues = {
    id: uuid(),
    title: '',
    description: '',
    location: '',
    provider: '',
    icon: '',
    color: '',
    universityId: profile?.universityId,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewOfferSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (offerToCreate: FormValuesProps) => {
    const { error } = await supabaseClient.from('offer').insert(offerToCreate);
    if (error) {
      enqueueSnackbar(`Error ${error.message}`, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Offer created');
    void push(PATH_DASHBOARD.offer.root);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name='title' label='Title' />

              <RHFTextField name='description' label='Description' />

              <RHFTextField name='location' label='Location' />

              <RHFTextField name='provider' label='Provider' />

              <RHFTextField name='icon' label='Icon' />

              <RHFTextField name='color' label='Color' />
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Create Offer
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
