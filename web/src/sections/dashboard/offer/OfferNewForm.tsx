import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { v4 as uuid } from 'uuid';
import useProfile from '../../../hooks/useProfile';
import { CustomFile } from '../../../components/upload';
import { useCallback } from 'react';
import useSubdomain from '../../../hooks/useSubdomain';

type FormValuesProps = {
  title: string;
  description: string;
  location: string;
  provider: string;
  imageUrl: CustomFile;
  color: string;
};

export default function OfferNewForm() {
  const { profile } = useProfile();
  const { subdomain } = useSubdomain();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const supabaseClient = useSupabaseClient();

  const NewOfferSchema = Yup.object().shape({
    title: Yup.string().required('Frosh title is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.string().required('Location is required'),
    provider: Yup.string().required('Provider is required'),
    imageUrl: Yup.mixed().test('required', 'Icon is required', (value) => value && value !== ''),
    color: Yup.string().required('Ticket price is required'),
  });

  const defaultValues = {
    title: '',
    description: '',
    location: '',
    provider: '',
    imageUrl: undefined,
    color: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewOfferSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (formValues: FormValuesProps) => {
    const { imageUrl, ...offerToCreate } = formValues;

    const imagePath = `offer/${imageUrl.name}`;

    const { data: deleteData, error: deleteError } = await supabaseClient
      .storage
      .from(subdomain)
      .remove([imagePath]);

    if (!deleteData || deleteError) {
      enqueueSnackbar('Error uploading imagee', { variant: 'error' });
      console.error(deleteError);
      return;
    }

    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from(subdomain)
      .upload(imagePath, imageUrl);

    if (!uploadData || uploadError) {
      enqueueSnackbar('Error uploading image', { variant: 'error' });
      console.error(uploadError);
      return;
    }

    const { data: { publicUrl: offerImageUrl } } = supabaseClient
      .storage
      .from(subdomain)
      .getPublicUrl(uploadData.path);

    const { error } = await supabaseClient
      .from('offer')
      .insert({
        ...offerToCreate,
        universityId: profile!.universityId,
        id: uuid(),
        imageUrl: offerImageUrl,
      });

    if (error) {
      enqueueSnackbar(`Error ${error.message}`, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Offer created');
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
              <RHFTextField name='title' label='Title' />

              <RHFTextField name='description' label='Description' />

              <RHFTextField name='location' label='Location' />

              <RHFTextField name='provider' label='Provider' />

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
