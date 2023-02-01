import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import { Offer } from '../../../../prisma/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useProfile from '../../../hooks/useProfile';
import { CustomFile } from '../../../components/upload';
import useSubdomain from '../../../hooks/useSubdomain';

type FormValuesProps = {
  title: string;
  description: string;
  location: string;
  provider: string;
  imageUrl: CustomFile | string;
};

type Props = {
  currentOffer: Offer;
  view?: boolean;
};

export default function OfferEditForm({ currentOffer, view }: Props) {
  const supabaseClient = useSupabaseClient();
  const { subdomain } = useSubdomain();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const NewTeamSchema = Yup.object().shape({
    title: Yup.string().required('Frosh title is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.string().required('Location is required'),
    provider: Yup.string().required('Provider is required'),
    imageUrl: Yup.mixed().test('required', 'Icon is required', (value) => value && value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentOffer.title,
      description: currentOffer.description,
      location: currentOffer.location,
      provider: currentOffer.provider,
      imageUrl: currentOffer.imageUrl,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOffer],
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewTeamSchema),
    defaultValues,
  });

  const {
    setValue,
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
    const { imageUrl, ...offer } = offerToUpdate;

    // user has not updated images
    if (typeof imageUrl === 'string') {
      const { error } = await supabaseClient
        .from('offer')
        .update(offer)
        .match({ id: currentOffer.id });

      if (error) {
        console.error(error);
        enqueueSnackbar(`Error updating offer`, { variant: 'error' });
        return;
      }

      enqueueSnackbar('Offer updated');
      void push(PATH_DASHBOARD.offer.root);
      return;
    }

    const splitImageUrl = currentOffer.imageUrl.split('/') || '';
    const oldImagePath = `offer/${splitImageUrl[splitImageUrl.length - 1]}`;
    const {
      data: deleteData,
      error: deleteError,
    } = await supabaseClient.storage.from(subdomain).remove([oldImagePath]);

    if (!deleteData || deleteError) {
      enqueueSnackbar(`Error updating offer 1`, { variant: 'error' });
      return;
    }

    const newImagePath = `offer/${imageUrl.name}`;

    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from(subdomain)
      .upload(newImagePath, imageUrl);

    if (!uploadData || uploadError) {
      enqueueSnackbar('Error updating offer 2', { variant: 'error' });
      return;
    }

    const { data: { publicUrl: offerImageUrl } } = supabaseClient
      .storage
      .from(subdomain)
      .getPublicUrl(uploadData.path);

    const { error } = await supabaseClient
      .from('offer')
      .update({ ...offer, imageUrl: offerImageUrl })
      .match({ id: currentOffer.id });

    if (error) {
      enqueueSnackbar(`Error updating offer 3`, { variant: 'error' });
      return;
    }
    enqueueSnackbar('Offer updated');
    void push(PATH_DASHBOARD.offer.root);
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'imageUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );
      }
    },
    [setValue],
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>

            <RHFUploadSingleFile name='imageUrl' maxSize={3145728} onDrop={handleDrop} sx={{ mb: 3 }} />

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
