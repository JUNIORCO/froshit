import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';
import { useSnackbar } from 'notistack';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
// utils
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { UserManager } from '../../../@types/user';
// _mock
// components
import { CustomFile } from '../../../components/upload';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import type { PrismaType } from '../../../../prisma';

// ----------------------------------------------------------------------

const sendTeamRequest = async (url: string, { arg }: any) => {
  const { method, ...team } = arg;
  const res = await fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(team),
  });
  return res.json();
};

type FormValuesProps = {
  name: string;
  froshId: number;
  leaders: any[];
  froshees: any[];
};

type Props = {
  isEdit?: boolean;
  currentTeam?: any;
  froshs: any[];
  profiles: any[];
};

export default function TeamNewEditForm({
                                          isEdit = false,
                                          currentTeam,
                                          froshs,
                                          profiles = [],
                                        }: Props) {
  const url = !isEdit ? '/api/team' : `/api/team/${currentTeam.id}`;
  const method = !isEdit ? 'POST' : 'PATCH';
  const { trigger } = useSWRMutation(url, sendTeamRequest);

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewTeamSchema = Yup.object().shape({
    name: Yup.string().required('Team name is required'),
    froshId: Yup.number().required('Frosh is required'),
    leaders: Yup.array().optional(),
    froshees: Yup.array().optional(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTeam?.name || '',
      froshId: currentTeam?.froshId || '',
      leaders: currentTeam?.profiles.filter((profile: any) => profile.role === 'Leader') || [],
      froshees: currentTeam?.profiles.filter((profile: any) => profile.role === 'Froshee') || [],
    }),
    [currentTeam],
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewTeamSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentTeam) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTeam]);

  const onSubmit = async ({
                            name,
                            froshId,
                            leaders,
                            froshees,
                          }: FormValuesProps) => {
    try {
      console.log(leaders, froshees);
      const teamToCreate = { name, froshId, profiles: leaders.concat(froshees) };
      console.log(teamToCreate);
      await trigger({ ...teamToCreate, method });
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      push(PATH_DASHBOARD.team.root);
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
              <RHFTextField name='name' label='Team Name' />

              <RHFSelect name='froshId' label='Frosh' placeholder='Frosh'>
                <option value='' />
                {froshs.map((frosh) => (
                  <option key={frosh.id} value={frosh.id}>
                    {frosh.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name='leaders' label='Unassigned Leaders' placeholder='Leaders'>
                <option value='' />
                {profiles.filter((profile: any) => profile.role === 'Leader').map((leader) => (
                  <option key={leader.id} value={leader.id}>
                    {leader.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name='froshees' label='Unassigned Froshees' placeholder='Froshees'>
                <option value='' />
                {profiles.filter((profile: any) => profile.role === 'Froshee').map((froshee) => (
                  <option key={froshee.id} value={froshee.id}>
                    {froshee.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                {!isEdit ? 'Create Team' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
