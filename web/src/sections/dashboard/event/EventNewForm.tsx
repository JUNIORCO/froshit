import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import { Frosh } from '../../../../prisma/types';
import RHFDateTimeRangeSelect from '../../../components/hook-form/RHFDateTimeRangeSelect';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { v4 as uuid } from 'uuid';
import { useCallback } from 'react';
import { CustomFile } from '../../../components/upload';
import useSubdomain from '../../../hooks/useSubdomain';
import { RHFMultiSelect } from '../../../components/hook-form/RHFMultiSelect';
import useSWRMutation from 'swr/mutation';

const addEventRequest = async (url: string, { arg }: any) => {
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

type EventForm = {
  id: string;
  imageUrl: CustomFile;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  accessibility: string;
  froshIds: string[];
};

type Props = {
  froshs: Frosh[];
};

export default function EventNewForm({ froshs }: Props) {
  const { trigger: createEventAPI } = useSWRMutation(`/api/event`, addEventRequest);
  const { subdomain } = useSubdomain();
  const supabaseClient = useSupabaseClient();

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewEventSchema = Yup.object().shape({
    imageUrl: Yup.mixed().test('required', 'Image is required', (value) => value && value !== ''),
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    startDate: Yup.date().required(),
    endDate: Yup.date().min(
      Yup.ref('startDate'),
      'End date cannot be before start date',
    ),
    location: Yup.string().required('Location is required'),
    accessibility: Yup.string().required('Accessibility is required'),
    froshIds: Yup.array().of(Yup.string()).min(1, 'At least one Frosh is required'),
  });

  const defaultValues = {
    id: uuid(),
    imageUrl: undefined,
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    location: '',
    accessibility: '',
    froshIds: [],
  };

  const methods = useForm<EventForm>({
    resolver: yupResolver(NewEventSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (eventForm: EventForm) => {
    const { imageUrl, ...eventToCreate } = eventForm;

    const imagePath = `event/${imageUrl.name}`;

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

    const { data: { publicUrl: eventImageUrl } } = supabaseClient
      .storage
      .from(subdomain)
      .getPublicUrl(uploadData.path);

    const { data, error } = await createEventAPI({
      ...eventToCreate,
      imageUrl: eventImageUrl,
    });

    if (error) {
      console.error(error);
      enqueueSnackbar(`Error creating event`, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Event created');
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

            <RHFUploadSingleFile name='imageUrl' maxSize={3145728} onDrop={handleDrop} sx={{ mb: 3 }} />

            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >

              <RHFTextField name='name' label='Name' />

              <RHFTextField name='description' label='Description' />

              <RHFTextField name='location' label='Location' />

              <RHFTextField name='accessibility' label='Accessibility' />

              <RHFMultiSelect
                name='froshIds'
                label='Froshs'
                options={froshs.map(({ id, name }) => ({ value: id, label: name }))}
              />

              <RHFDateTimeRangeSelect name='startDate' label='Start Date' />

              <RHFDateTimeRangeSelect name='endDate' label='End Date' />
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Create Event
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
