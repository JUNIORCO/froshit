import React, { useCallback, useEffect, useMemo } from 'react';
import { Box, Card, Container, Grid, Stack } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../../../../components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthApi from '../../../../../../../prisma/api/AuthApi';
import { Role, University } from 'prisma/types';
import { CustomFile } from '../../../../../../components/upload';
import RoleBasedGuard from '../../../../../../guards/RoleBasedGuard';
import useSubdomain from '../../../../../../hooks/useSubdomain';
import useRefresh from '../../../../../../hooks/useRefresh';

UniversityIdentityPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type UniversityIdentityForm = {
  imageUrl: CustomFile | string;
  color: string;
};

type UniversityIdentityPageProps = {
  university: University;
}

export default function UniversityIdentityPage({ university }: UniversityIdentityPageProps) {
  const { themeStretch } = useSettings();
  const { subdomain } = useSubdomain();
  const supabaseClient = useSupabaseClient();
  const { replace } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { refreshData } = useRefresh();

  const NewTeamSchema = Yup.object().shape({
    imageUrl: Yup.mixed().test('required', 'University logo is required', (value) => value !== ''),
    color: Yup.string().required('Main color is required'),
  });

  const defaultValues = useMemo(
    () => ({
      imageUrl: university.imageUrl || '',
      color: university.color,
    }),
    [university],
  );

  const methods = useForm<UniversityIdentityForm>({
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
    if (university) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [university]);

  const onSubmit = async ({ imageUrl, color }: UniversityIdentityForm) => {
    // user has not updated image
    if (typeof imageUrl === 'string') {
      enqueueSnackbar('Should update color only');
      refreshData();
      return;
    }

    const splitImageUrl = university.imageUrl.split('/') || '';
    const oldImagePath = splitImageUrl[splitImageUrl.length - 1];
    const {
      data: deleteData,
      error: deleteError,
    } = await supabaseClient
      .storage
      .from(subdomain)
      .remove([oldImagePath]);

    if (!deleteData || deleteError) {
      enqueueSnackbar(`Error deleting old logo`, { variant: 'error' });
      return;
    }

    const newImagePath = imageUrl.name;

    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from(subdomain)
      .upload(newImagePath, imageUrl);

    if (!uploadData || uploadError) {
      enqueueSnackbar('Error uploading new logo', { variant: 'error' });
      return;
    }

    const { data: { publicUrl: universityLogoUrl } } = supabaseClient
      .storage
      .from(subdomain)
      .getPublicUrl(uploadData.path);

    const { error } = await supabaseClient
      .from('university')
      .update({ imageUrl: universityLogoUrl })
      .match({ id: university.id });

    enqueueSnackbar(error ? 'Error updating row' : 'Logo updated', { variant: error ? 'error' : 'success' });
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
      <Page title='University Identity'>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading='Edit Your University Identity'
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'University Identity' },
            ]}
          />

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
                    <RHFTextField name='color' label='Main Color' />
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

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });
  const university = await api.University.getUniversity();

  return {
    props: {
      university,
    },
  };
};
