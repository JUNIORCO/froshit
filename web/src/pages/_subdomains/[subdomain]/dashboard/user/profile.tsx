import React, { useCallback } from 'react';
import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import RoleBasedGuard from '../../../../../guards/RoleBasedGuard';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../../../components/hook-form';
import { LoadingButton } from '@mui/lab';
import useProfile from '../../../../../hooks/useProfile';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useSWRMutation from 'swr/mutation';
import { GetServerSideProps } from 'next';
import { Role } from '../../../../../../prisma/types';
import useSubdomain from '../../../../../hooks/useSubdomain';
import useRefresh from '../../../../../hooks/useRefresh';
import { CustomFile } from '../../../../../components/upload';
import { fData } from '../../../../../utils/formatNumber';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const sendInviteRequest = async (url: string, { arg }: any) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
  return res.json();
};

UserProfile.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type FormValuesProps = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  imageUrl: CustomFile | string;
};

export default function UserProfile() {
  const { profile } = useProfile();

  const supabaseClient = useSupabaseClient();
  const { subdomain } = useSubdomain();
  const { refreshData } = useRefresh();
  const { trigger: sendInviteAPI } = useSWRMutation('/api/user', sendInviteRequest);
  const { themeStretch } = useSettings();

  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const UpdateProfileSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
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
      const { error } = await supabaseClient.from('profile').update(profileWithoutImage).match({ id: profile!.id });
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
      } = await supabaseClient.storage.from(subdomain).remove([oldImagePath]);

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

    const { error } = await supabaseClient.from('profile').update({
      ...profileWithoutImage,
      imageUrl: profileImageUrl,
    }).match({ id: profile!.id });

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
    <RoleBasedGuard hasContent roles={[Role.Admin]}>
      <Page title='Your Profile'>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading='Your Profile'
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Profile' },
            ]}
          />

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
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
