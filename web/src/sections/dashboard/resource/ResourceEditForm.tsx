import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { ResourceTag } from '../../../../prisma/types';
import { FullResource } from '../../../../prisma/api/@types';

const sendResourceEditRequest = async (url: string, { arg: resource }: any) => {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resource),
  });
  return res.json();
};

type FormValuesProps = {
  name: string;
  description: string;
};

type Props = {
  resource: FullResource;
  resourceTags: ResourceTag[];
}

export default function ResourceEditForm({ resource, resourceTags }: Props) {
  const { trigger } = useSWRMutation(`/api/resource/${resource.id}`, sendResourceEditRequest);

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewResourceSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    phoneNumber: Yup.string().optional(),
    email: Yup.string().email().optional(),
    resourceTagId: Yup.string().required('Tag is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: resource.title || '',
      description: resource.description || '',
      phoneNumber: resource.phoneNumber || '',
      email: resource.email || '',
      resourceTagId: resource.resourceTagId || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resource],
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewResourceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (resource) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  const onSubmit = async (resourceToUpdate: FormValuesProps) => {
    try {
      await trigger({ ...resourceToUpdate, universityId: '1678f7bf-7a13-477c-942c-c85dcadfdd40' });
      enqueueSnackbar('Update success!');
      void push(PATH_DASHBOARD.resource.root);
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

              <RHFTextField name='phoneNumber' label='Phone Number' />

              <RHFTextField name='email' label='Email' />

              <RHFSelect name='resourceTagId' label='Tag' placeholder='Tag'>
                <option value='' />
                {resourceTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </RHFSelect>
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
