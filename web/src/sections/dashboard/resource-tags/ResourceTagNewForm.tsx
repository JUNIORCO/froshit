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

type FormValuesProps = {
  imageUrl: CustomFile;
  name: string;
};

export default function ResourceTagNewForm() {
  const { subdomain } = useSubdomain();
  const supabaseClient = useSupabaseClient();

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewResourceTagSchema = Yup.object().shape({
    imageUrl: Yup.string().required('Image is required'),
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    imageUrl: undefined,
    name: '',
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

  const onSubmit = async (tagToCrate: FormValuesProps) => {
    const { imageUrl, name } = tagToCrate;

    const imagePath = `resource_tag/${imageUrl.name}`;

    const { data: deleteData, error: deleteError } = await supabaseClient.storage.from(subdomain).remove([imagePath]);

    if (!deleteData || deleteError) {
      enqueueSnackbar('Error deleting old image', { variant: 'error' });
      console.error(deleteError);
      return;
    }

    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from(subdomain)
      .upload(imagePath, imageUrl);

    if (!uploadData || uploadError) {
      enqueueSnackbar('Error uploading image', { variant: 'error' });
      console.error(uploadError);
      return;
    }

    const { data: { publicUrl: resourceTagImageUrl } } = supabaseClient.storage.from(subdomain).getPublicUrl(uploadData.path);

    const { error } = await supabaseClient.from('resource_tag').insert({ name, imageUrl: resourceTagImageUrl });

    if (error) {
      enqueueSnackbar(`Error creating resource tag`, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Resource tag created');
    void push(PATH_DASHBOARD.event.root);
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
              <RHFUploadSingleFile name='imageUrl' maxSize={3145728} onDrop={handleDrop} sx={{ mb: 3 }} />

              <RHFTextField name='name' label='Name' />
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
