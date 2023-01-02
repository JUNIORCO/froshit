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
import type { FullTeam, UnassignedFrosheesAndLeaders } from '../../../../prisma/api/@types';
import { isEqual } from 'lodash';

const sendTeamRequest = async (url: string, { arg }: any) => {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
  return res.json();
};

type FormValuesProps = {
  name: string;
  number: string;
  froshId: string;
  leaderIds: string[];
  frosheeIds: string[];
};

type Props = {
  currentTeam: FullTeam;
  froshs: Frosh[];
  profiles: UnassignedFrosheesAndLeaders[];
  view?: boolean;
};

export default function TeamNewForm({
                                      currentTeam,
                                      froshs,
                                      profiles,
                                      view,
                                    }: Props) {
  const { trigger } = useSWRMutation(`/api/team/${currentTeam.id}`, sendTeamRequest);

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const currentTeamLeaders: Profile[] = currentTeam.profiles?.filter((profile) => profile.role === Role.Leader) || [];
  const currentTeamFroshees: Profile[] = currentTeam.profiles?.filter((profile) => profile.role === Role.Froshee) || [];

  const currentTeamLeadersOptions = currentTeamLeaders.map((leader) => ({
    label: `${leader.firstName} ${leader.lastName}`,
    value: leader.id,
  }));
  const currentTeamFrosheeOptions = currentTeamFroshees.map((froshee) => ({
    label: `${froshee.firstName} ${froshee.lastName}`,
    value: froshee.id,
  }));

  const allLeaderOptions = profiles.filter((profile) => profile.role === Role.Leader).map((leader) => ({
    label: `${leader.firstName} ${leader.lastName}`,
    value: leader.id,
  })).concat(currentTeamLeadersOptions);
  const allFrosheeOptions = profiles.filter((profile) => profile.role === Role.Froshee && profile.froshId === currentTeam.froshId).map((froshee) => ({
    label: `${froshee.firstName} ${froshee.lastName}`,
    value: froshee.id,
  })).concat(currentTeamFrosheeOptions);

  const NewTeamSchema = Yup.object().shape({
    name: Yup.string().required('Team name is required'),
    number: Yup.string().required('Team number is required'),
    froshId: Yup.string().required('Frosh is required'),
    leaderIds: Yup.array().optional(),
    frosheeIds: Yup.array().optional(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTeam.name,
      number: currentTeam.number,
      froshId: currentTeam.froshId,
      leaderIds: currentTeamLeaders.map(leader => leader.id),
      frosheeIds: currentTeamFroshees.map(froshee => froshee.id),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTeam],
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
    if (currentTeam) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTeam]);

  const onSubmit = async ({
                            name,
                            number,
                            froshId,
                            leaderIds,
                            frosheeIds,
                          }: FormValuesProps) => {
    const teamToUpdate = { name, number, froshId, profiles: leaderIds.concat(frosheeIds) };

    const { error } = await trigger(teamToUpdate);
    if (error) {
      if (error.code === 'P2002' && isEqual(error.meta.target, ['froshId', 'number'])) {
        enqueueSnackbar('Team number already taken for selected froshs', { variant: 'error' });
      }
      return;
    }
    enqueueSnackbar('Team updated');
    push(PATH_DASHBOARD.team.root);
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
              <RHFTextField name='name' label='Team Name' disabled={view} />

              <RHFTextField name='number' label='Team Number' disabled={view} />

              <RHFSelect name='froshId' label='Frosh' placeholder='Frosh' disabled={view || !!currentTeam}>
                <option value='' />
                {froshs.map((frosh) => (
                  <option key={frosh.id} value={frosh.id}>
                    {frosh.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFMultiSelect
                name='leaderIds'
                label='Leaders'
                options={allLeaderOptions}
                disabled={view}
              />

              <RHFMultiSelect
                name='frosheeIds'
                label='Froshees'
                options={allFrosheeOptions}
                disabled={view}
              />
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
