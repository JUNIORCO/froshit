import { useSnackbar } from 'notistack';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { CustomFile } from '../../../../components/upload';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { fData } from '../../../../utils/formatNumber';
import { LoadingButton } from '@mui/lab';
import React, { useCallback } from 'react';
import useProfile from '../../../../hooks/useProfile';
import useSubdomain from '../../../../hooks/useSubdomain';
import useRefresh from '../../../../hooks/useRefresh';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type FormValuesProps = {
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  role: string;
  imageUrl: CustomFile | string;
};

export default function AccountGeneral() {
  const { profile } = useProfile();
  const { subdomain } = useSubdomain();
  const { refreshData } = useRefresh();
  const { enqueueSnackbar } = useSnackbar();
  const supabaseClient = useSupabaseClient();

  const UpdateProfileSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    phoneNumber: Yup.string().nullable(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    role: Yup.string().required('Role is required'),
    imageUrl: Yup.mixed(),
  });

  const defaultValues = {
    email: profile!.email,
    phoneNumber: profile!.phoneNumber,
    firstName: profile!.firstName,
    lastName: profile!.lastName,
    role: profile!.role,
    imageUrl: profile!.imageUrl || '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateProfileSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (updatedProfile: FormValuesProps) => {
    const { imageUrl, ...profileWithoutImage } = updatedProfile;

    // user has not updated image
    if (typeof imageUrl === 'string') {
      const { error } = await supabaseClient
        .from('profile')
        .update(profileWithoutImage)
        .match({ id: profile!.id });
      enqueueSnackbar(error ? `Error updating profile 1` : 'Profile updated', { variant: error ? 'error' : 'success' });
      refreshData();
      return;
    }

    // if already uploaded an image, delete the old one
    if (profile!.imageUrl) {
      const splitImageUrl = profile!.imageUrl.split('/') || '';
      const oldImagePath = `profile/${splitImageUrl[splitImageUrl.length - 1]}`;
      const {
        data: deleteData,
        error: deleteError,
      } = await supabaseClient
        .storage
        .from(subdomain)
        .remove([oldImagePath]);

      if (!deleteData || deleteError) {
        enqueueSnackbar(`Error removing old image`, { variant: 'error' });
        return;
      }
    }

    const newImagePath = `profile/${imageUrl.name}`;

    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from(subdomain)
      .upload(newImagePath, imageUrl);

    if (!uploadData || uploadError) {
      enqueueSnackbar('Error uploading new image', { variant: 'error' });
      return;
    }

    const { data: { publicUrl: profileImageUrl } } = supabaseClient
      .storage
      .from(subdomain)
      .getPublicUrl(uploadData.path);

    const { error } = await supabaseClient
      .from('profile')
      .update({
        ...profileWithoutImage,
        imageUrl: profileImageUrl,
      })
      .match({ id: profile!.id });

    if (error) {
      enqueueSnackbar('Error updating profile 3', { variant: 'error' });
      return;
    }
    enqueueSnackbar('Profile updated');
    refreshData();
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
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name='imageUrl'
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant='caption'
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

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
              <RHFTextField name='email' label='Email' disabled />

              <RHFTextField name='phoneNumber' label='Phone Number' />

              <RHFTextField name='firstName' label='First Name' />

              <RHFTextField name='lastName' label='Last Name' />

              <RHFTextField name='role' label='Role' disabled />
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
