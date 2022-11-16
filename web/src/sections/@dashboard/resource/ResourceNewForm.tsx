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
import { RHFMultiSelect } from '../../../components/hook-form/RHFMultiSelect';

const sendTeamCreateRequest = async (url: string, { arg }: any) => {
  const { method, ...team } = arg;
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
  froshId: string;
  leaders: any[];
  froshees: any[];
};

type Props = {
  isEdit?: boolean;
  currentTeam?: any;
  froshs: any[];
  profiles: any[];
};

export default function ResourceNewForm({
                                      froshs,
                                      profiles = [],
                                    }: Props) {
  const { trigger } = useSWRMutation('/api/team', sendTeamCreateRequest);

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewTeamSchema = Yup.object().shape({
    name: Yup.string().required('Team name is required'),
    froshId: Yup.string().required('Frosh is required'),
    leaders: Yup.array().optional(),
    froshees: Yup.array().optional(),
  });

  const defaultValues = {
    name: '',
    froshId: '',
    leaders: [],
    froshees: [],
  };

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

  const onSubmit = async ({
                            name,
                            froshId,
                            leaders,
                            froshees,
                          }: FormValuesProps) => {
    try {
      const teamToCreate = { name, froshId, profiles: leaders.concat(froshees) };
      await trigger(teamToCreate);
      reset();
      enqueueSnackbar('Create success!');
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

              <RHFMultiSelect
                name='leaders'
                label='Unassigned Leaders'
                options={profiles
                  .filter((profile: any) => profile.role === 'Leader').map((profile) => ({
                    label: profile.name,
                    value: profile.id,
                  }))}
              />

              <RHFMultiSelect
                name='froshees'
                label='Unassigned Froshees'
                options={profiles
                  .filter((profile: any) => profile.role === 'Froshee').map((profile) => ({
                    label: profile.name,
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
