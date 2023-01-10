import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import React, { useCallback } from 'react';
import { CustomFile } from '../../../components/upload';
import useSubdomain from '../../../hooks/useSubdomain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ResourceTag } from '../../../../prisma/types';
import { handleImageUpload } from '../../../utils/imageUpload';

type FormValuesProps = {
  imageUrl: CustomFile | string;
  name: string;
};

type Props = {
  currentResourceTag: ResourceTag;
  view?: boolean;
};

export default function ResourceTagEditForm({ currentResourceTag, view }: Props) {
  const { subdomain } = useSubdomain();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const supabaseClient = useSupabaseClient();

  const NewResourceTagSchema = Yup.object().shape({
    imageUrl: Yup.string().required('Image is required'),
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    imageUrl: currentResourceTag.imageUrl,
    name: currentResourceTag.name,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewResourceTagSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ name, imageUrl }: FormValuesProps) => {
    // user has not updated image
    if (typeof imageUrl === 'string') {
      const { error } = await supabaseClient
        .from('resource_tag')
        .update({ name })
        .match({ id: currentResourceTag.id });
      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
      enqueueSnackbar('Resource tag updated');
      void push(PATH_DASHBOARD.resourceTag.root);
      return;
    }

    const splitImageUrl = currentResourceTag.imageUrl.split('/') || '';
    const oldImagePath = `resource_tag/${splitImageUrl[splitImageUrl.length - 1]}`;

    const { data: imageUploadData, error: imageUploadError } = await handleImageUpload({
      supabaseClient,
      subdomain,
      bucketName: 'resource_tag',
      image: imageUrl,
      oldImagePath,
    });

    if (!imageUploadData || imageUploadError) {
      enqueueSnackbar(imageUploadError, { variant: 'error' });
      console.error(imageUploadError);
      return;
    }

    const { error } = await supabaseClient
      .from('resource_tag')
      .update({
        name,
        imageUrl: imageUploadData.imageUrl,
      })
      .match({ id: currentResourceTag.id });

    if (error) {
      enqueueSnackbar(`Error updating resource tag`, { variant: 'error' });
      return;
    }
    enqueueSnackbar('Resource tag updated');
    void push(PATH_DASHBOARD.resourceTag.root);
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
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFUploadSingleFile
                name='imageUrl'
                maxSize={3145728}
                onDrop={handleDrop}
                sx={{ mb: 3 }}
                disabled={view}
              />

              <RHFTextField name='name' label='Name' disabled={view} />
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Create Resource Tag
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
