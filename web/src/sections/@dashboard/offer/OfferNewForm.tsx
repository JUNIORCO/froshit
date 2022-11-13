import * as Yup from 'yup';
import useSWRMutation from 'swr/mutation';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSlider, RHFTextField } from '../../../components/hook-form';

const sendOfferCreateRequest = async (url: string, { arg: offer }: any) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(offer),
  });
  return res.json();
};

type FormValuesProps = {
  name: string;
  description: string;
  ticketPrice: number;
};

export default function OfferNewForm() {
  const { trigger } = useSWRMutation('/api/offer', sendOfferCreateRequest);

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
    title: '',
    description: '',
    location: '',
    provider: '',
    icon: '',
    color: '',
    universityId: '1678f7bf-7a13-477c-942c-c85dcadfdd40',
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

  const onSubmit = async (froshToCreate: FormValuesProps) => {
    try {
      await trigger(froshToCreate);
      reset();
      enqueueSnackbar('Created offer!');
      void push(PATH_DASHBOARD.offer.root);
    } catch (error) {
      console.error(error);
    }
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
