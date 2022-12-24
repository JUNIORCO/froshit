// @ts-nocheck
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, FormControlLabel, Grid, Stack, Switch, Typography } from '@mui/material';
import { fData } from '../../../utils/formatNumber';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Label from '../../../components/Label';
import { CustomFile } from '../../../components/upload';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { RHFMultiSelect } from '../../../components/hook-form/RHFMultiSelect';
import { FullProfile } from '../../../../prisma/api/@types';
import { Frosh, Profile, Role, Team } from '../../../../prisma/types';
import useProfile from '../../../hooks/useProfile';

const sendProfileRequest = async (url: string, { arg }: any) => {
  const { method, ...profile } = arg;
  const res = await fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
  return res.json();
};

interface FormValuesProps extends Omit<Profile, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  currentUser?: FullProfile;
  froshs: Frosh[];
  teams: Team[];
};

export default function UserNewEditForm({
                                          currentUser,
                                          froshs,
                                          teams,
                                        }: Props) {
  const { profile } = useProfile();
  const url = !currentUser ? '/api/profile' : `/api/profile/${currentUser.id}`;
  const method = !currentUser ? 'POST' : 'PATCH';
  const { trigger } = useSWRMutation(url, sendProfileRequest);

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone number is required'),
    role: Yup.mixed().oneOf(Object.values(Role)).required('Role is required'),
    froshId: Yup.string().defined(),
    teamId: Yup.string().defined(),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      role: currentUser?.role,
      froshId: currentUser?.froshId || '',
      teamId: currentUser?.teamId || '',
      universityId: profile?.universityId,
    }),
    [currentUser],
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
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
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await trigger({
        ...data,
        froshId: data.froshId || null,
        teamId: data.teamId || null,
        method,
      });
      enqueueSnackbar(!currentUser ? 'Created user' : 'Updated user');
      void push(PATH_DASHBOARD.user.root);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
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
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {currentUser && (
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name='avatarUrl'
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant='caption'
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement='start'
                control={
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant='subtitle2' sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}
          </Card>
        </Grid>

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
              <RHFTextField name='firstName' label='First Name' />
              <RHFTextField name='lastName' label='Last Name' />
              <RHFTextField name='email' label='Email Address' />
              <RHFTextField name='phoneNumber' label='Phone Number' />

              <RHFSelect name='role' label='Role' placeholder='Role'>
                <option value='' />
                {[Role.Froshee].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name='froshId' label='Frosh' placeholder='Frosh'>
                <option value='' />
                {froshs.map((frosh) => (
                  <option key={frosh.id} value={frosh.id}>
                    {frosh.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name='teamId' label='Team' placeholder='Team'>
                <option value='' />
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                {!currentUser ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
