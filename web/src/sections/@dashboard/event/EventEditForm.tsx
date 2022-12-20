import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import { Frosh } from '../../../../prisma/types';
import { FullEvent } from '../../../../prisma/api/@types';
import RHFDateTimeRangeSelect from '../../../components/hook-form/RHFDateTimeRangeSelect';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { CustomFile } from '../../../components/upload';
import useSubdomain from '../../../hooks/useSubdomain';

type EventForm = {
  id: string;
  imageUrl: CustomFile | string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  accessibility: string;
  froshId: string;
};

type Props = {
  currentEvent: FullEvent;
  froshs?: Frosh[];
  view?: boolean;
};

export default function EventEditForm({
                                        currentEvent,
                                        froshs,
                                        view,
                                      }: Props) {
  const supabaseClient = useSupabaseClient();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { subdomain } = useSubdomain();

  const NewTeamSchema = Yup.object().shape({
    imageUrl: Yup.mixed().test('required', 'Image is required', (value) => value !== ''),
    name: Yup.string().required('Event name is required'),
    description: Yup.string().required('Description is required'),
    startDate: Yup.date().required(),
    endDate: Yup.date().min(
      Yup.ref('startDate'),
      'End date cannot be before start date',
    ),
    location: Yup.string().required('Location is required'),
    accessibility: Yup.string().required('Accessibility is required'),
    froshId: Yup.string().required('Frosh is required'),
  });

  const defaultValues = useMemo(
    () => ({
      imageUrl: currentEvent.imageUrl || '',
      name: currentEvent.name,
      description: currentEvent.description,
      startDate: currentEvent.startDate,
      endDate: currentEvent.endDate,
      location: currentEvent.location,
      accessibility: currentEvent.accessibility,
      froshId: currentEvent.froshId,
    }),
    [currentEvent],
  );

  const methods = useForm<EventForm>({
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
    if (currentEvent) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent]);

  const onSubmit = async (updatedEvent: EventForm) => {
    const { imageUrl, ...event } = updatedEvent;
    console.log('imageUrl : ', imageUrl);
    console.log('event : ', event);
    if (typeof imageUrl !== 'string') {
      console.log('not of type string');
      if (currentEvent.imageUrl) {
        const splitImageUrl = currentEvent.imageUrl.split('/') || '';
        const oldImagePath = `event/${splitImageUrl[splitImageUrl.length - 1]}`;
        const {
          data: deleteData,
          error: deleteError,
        } = await supabaseClient.storage.from(subdomain).remove([oldImagePath]);

        if (!deleteData || deleteError) {
          enqueueSnackbar(`Error updating event 1`, { variant: 'error' });
          console.error(deleteError);
          return;
        }
      }

      const newImagePath = `event/${imageUrl.name}`;

      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from(subdomain)
        .upload(newImagePath, imageUrl);

      if (!uploadData || uploadError) {
        enqueueSnackbar('Error updating event 2', { variant: 'error' });
        console.error(uploadError);
        return;
      }

      const { data: { publicUrl: eventImageUrl } } = supabaseClient.storage.from(subdomain).getPublicUrl(uploadData.path);

      const { error } = await supabaseClient.from('event').update({
        ...event,
        imageUrl: eventImageUrl,
      }).match({ id: currentEvent.id });

      if (error) {
        enqueueSnackbar(`Error updating event 3`, { variant: 'error' });
        return;
      }
      enqueueSnackbar('Event updated');
      void push(PATH_DASHBOARD.event.root);
    } else {
      console.log('of type string');
      const { error } = await supabaseClient.from('event').update(event).match({ id: currentEvent.id });
      if (error) {
        enqueueSnackbar(`Error updating event 4`, { variant: 'error' });
        return;
      }
      enqueueSnackbar('Event updated');
      void push(PATH_DASHBOARD.event.root);
    }
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

            <RHFUploadSingleFile name='imageUrl' maxSize={3145728} onDrop={handleDrop} sx={{ mb: 3 }} disabled={view} />

            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name='name' label='Name' disabled={view} />

              <RHFTextField name='description' label='Description' disabled={view} />

              <RHFTextField name='location' label='Location' disabled={view} />

              <RHFTextField name='accessibility' label='Accessibility' disabled={view} />

              <RHFSelect name='froshId' label='Frosh' placeholder='Frosh' disabled={view}>
                <option value='' />
                {view ? (
                  <option key={currentEvent.frosh.id} value={currentEvent.frosh.id}>
                    {currentEvent.frosh.name}
                  </option>
                ) : froshs?.map((frosh) => (
                  <option key={frosh.id} value={frosh.id}>
                    {frosh.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFDateTimeRangeSelect name='startDate' label='Start Date' disabled={view} />

              <RHFDateTimeRangeSelect name='endDate' label='End Date' disabled={view} />
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
