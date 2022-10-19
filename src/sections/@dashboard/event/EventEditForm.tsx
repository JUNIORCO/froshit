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
import { RHFMultiSelect } from '../../../components/hook-form/RHFMultiSelect';
import { Frosh, Profile, Role } from '../../../../prisma/types';
import { UnassignedFrosheesAndLeaders } from '../../../../prisma/user/get';
import { FullTeam } from '../../../../prisma/team/get';
import { FullEvent } from '../../../../prisma/events/get';
import RHFDateTimeRangeSelect from '../../../components/hook-form/RHFDateTimeRangeSelect';

const sendEventRequest = async (url: string, { arg: eventToUpdate }: any) => {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventToUpdate),
  });
  return res.json();
};

type FormValuesProps = {
  imageUrl: string | null;
  name: string | null;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  location: string | null;
  accessibility: string | null;
  froshId: number | null;
};

type Props = {
  currentEvent: FullEvent;
  froshs: Frosh[];
};

export default function EventNewForm({
                                      currentEvent,
                                      froshs,
                                    }: Props) {
  const { trigger } = useSWRMutation(`/api/event/${currentEvent.id}`, sendEventRequest);

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewTeamSchema = Yup.object().shape({
    imageUrl: Yup.string(),
    name: Yup.string().required('Event name is required'),
    description: Yup.string().required('Description is required'),
    startDate: Yup.date().required(),
    endDate: Yup.date().min(
      Yup.ref('startDate'),
      'End date cannot be before start date',
    ),
    location: Yup.string().required('Location is required'),
    accessibility: Yup.string().required('Accessibility is required'),
    froshId: Yup.number().required('Frosh is required'),
  });

  const defaultValues = useMemo(
    () => ({
      imageUrl: currentEvent.imageUrl,
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

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewTeamSchema),
    defaultValues,
  });

  const {
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

  const onSubmit = async (updatedEvent: FormValuesProps) => {
    try {
      console.log(updatedEvent)
      await trigger(updatedEvent);
      reset();
      enqueueSnackbar('Update success!');
      push(PATH_DASHBOARD.event.root);
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
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
