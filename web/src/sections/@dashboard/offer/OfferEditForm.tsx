import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { Offer } from '../../../../prisma/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useProfile from '../../../hooks/useProfile';
import { uuid } from '@supabase/gotrue-js/dist/main/lib/helpers';

type FormValuesProps = {
  name: string;
  description: string;
  ticketPrice: number;
};

type Props = {
  currentOffer: Offer;
  view?: boolean;
};

export default function OfferEditForm({ currentOffer, view }: Props) {
  const { profile } = useProfile();
  const supabaseClient = useSupabaseClient();

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewTeamSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.string().required('Location is required'),
    provider: Yup.string().required('Provider is required'),
    icon: Yup.string().required('Icon is required'),
    color: Yup.string().required('Color is required'),
    universityId: Yup.string().required('University is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: uuid(),
      title: currentOffer.title,
      description: currentOffer.description,
      location: currentOffer.location,
      provider: currentOffer.provider,
      icon: currentOffer.icon,
      color: currentOffer.color,
      universityId: profile?.universityId,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOffer],
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewTeamSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentOffer) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOffer]);

  const onSubmit = async (offerToUpdate: FormValuesProps) => {
    const { error } = await supabaseClient.from('offer').update(offerToUpdate).match({ id: currentOffer.id });
    if (error) {
      enqueueSnackbar(`Error ${error.message}`, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Offer updated');
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
              <RHFTextField name='title' label='Title' disabled={view} />

              <RHFTextField name='description' label='Description' disabled={view} />

              <RHFTextField name='location' label='Location' disabled={view} />

              <RHFTextField name='provider' label='Provider' disabled={view} />

              <RHFTextField name='icon' label='Icon' disabled={view} />

              <RHFTextField name='color' label='Color' disabled={view} />
            </Box>

            {!view && <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
