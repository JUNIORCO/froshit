import * as Yup from 'yup';
import useSWRMutation from 'swr/mutation';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { Frosh } from '../../../../prisma/types';
import RHFDateTimeRangeSelect from '../../../components/hook-form/RHFDateTimeRangeSelect';

const sendEventCreateRequest = async (url: string, { arg: eventToCreate }: any) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventToCreate),
  });
  return res.json();
};

type FormValuesProps = {
  name: string | null;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  location: string | null;
  accessibility: string | null;
  froshId: string | null;
};

type Props = {
  froshs: Frosh[];
};

export default function EventNewForm({ froshs }: Props) {
  const { trigger } = useSWRMutation('/api/event', sendEventCreateRequest);

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewEventSchema = Yup.object().shape({
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

  const defaultValues = {
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    location: '',
    accessibility: '',
    froshId: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewEventSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (eventToCreate: FormValuesProps) => {
    try {
      console.log(eventToCreate)
      await trigger(eventToCreate);
      reset();
      enqueueSnackbar('Create success!');
      void push(PATH_DASHBOARD.event.root);
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
              <RHFTextField name='name' label='Name' />

              <RHFTextField name='description' label='Description' />

              <RHFTextField name='location' label='Location' />

              <RHFTextField name='accessibility' label='Accessibility' />

              <RHFSelect name='froshId' label='Frosh' placeholder='Frosh'>
                <option value='' />
                {froshs.map((frosh) => (
                  <option key={frosh.id} value={frosh.id}>
                    {frosh.name}
                  </option>
                ))}
              </RHFSelect>

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
