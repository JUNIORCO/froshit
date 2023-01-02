import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { RHFMultiSelect } from '../../../components/hook-form/RHFMultiSelect';
import useSWRMutation from 'swr/mutation';
import { isEqual } from 'lodash';
import { FroshsWithStats, UnassignedFrosheesAndLeaders } from '../../../../prisma/api/@types';

const sendTeamCreateRequest = async (url: string, { arg: team }: any) => {
  const res = await fetch(url, {
    method: 'POST',
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
  number: string;
  froshId: string;
  leaders: any[];
  froshees: any[];
};

type Props = {
  froshs: FroshsWithStats[];
  profiles: UnassignedFrosheesAndLeaders[];
};

export default function TeamNewForm({
                                      froshs,
                                      profiles = [],
                                    }: Props) {
  const { trigger } = useSWRMutation('/api/team', sendTeamCreateRequest);
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const NewTeamSchema = Yup.object().shape({
    name: Yup.string().required('Team name is required'),
    number: Yup.string().required('Team number is required'),
    froshId: Yup.string().required('Frosh is required'),
    leaders: Yup.array().optional(),
    froshees: Yup.array().optional(),
  });

  const defaultValues = {
    name: '',
    number: '',
    froshId: '',
    leaders: [],
    froshees: [],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewTeamSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({
                            name,
                            number,
                            froshId,
                            leaders,
                            froshees,
                          }: FormValuesProps) => {
    const teamToCreate = { name, number, froshId, profiles: leaders.concat(froshees) };
    const { error } = await trigger(teamToCreate);
    if (error) {
      if (error.code === 'P2002' && isEqual(error.meta.target, ['froshId', 'number'])) {
        enqueueSnackbar('Team number taken', { variant: 'error' });
      } else if (error.code === 'P2002' && isEqual(error.meta.target, ['froshId', 'name'])) {
        enqueueSnackbar('Team name taken', { variant: 'error' });
      }
      return;
    }
    enqueueSnackbar('Team created');
    push(PATH_DASHBOARD.team.root);
  };

  const payload = watch();

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

              <RHFTextField name='number' label='Team Number' />

              <RHFSelect name='froshId' label='Frosh' placeholder='Frosh'>
                <option value='' />
                {froshs.map((frosh) => (
                  <option key={frosh.id} value={frosh.id}>
                    {frosh.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFMultiSelect
                name='leaders'
                label='Unassigned Leaders'
                options={profiles
                  .filter((profile) => profile.role === 'Leader' && profile.froshId === payload.froshId).map((profile) => ({
                    label: `${profile.firstName} ${profile.lastName}`,
                    value: profile.id,
                  }))}
              />

              <RHFMultiSelect
                name='froshees'
                label='Unassigned Froshees'
                options={profiles
                  .filter((profile) => profile.role === 'Froshee' && profile.froshId === payload.froshId).map((profile) => ({
                    label: `${profile.firstName} ${profile.lastName}`,
                    value: profile.id,
                  }))}
              />
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Create Team
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
