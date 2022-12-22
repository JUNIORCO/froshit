import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSlider, RHFTextField } from '../../../components/hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { v4 as uuid } from 'uuid';
import useProfile from '../../../hooks/useProfile';

type FormValuesProps = {
  name: string;
  description: string;
  universityId: string;
};

export default function FroshNewForm() {
  const { profile } = useProfile();
  const supabaseClient = useSupabaseClient();

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewTeamSchema = Yup.object().shape({
    name: Yup.string().required('Frosh name is required'),
    description: Yup.string().required('Description is required'),
    universityId: Yup.string().required(),
  });

  const defaultValues = {
    id: uuid(),
    name: '',
    description: '',
    universityId: profile?.universityId,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewTeamSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch
  } = methods;

  const payload = watch();

  const onSubmit = async (froshToCreate: FormValuesProps) => {
    const { error } = await supabaseClient.from('frosh').insert(froshToCreate);
    if (error) {
      enqueueSnackbar(`Error ${error.message}`, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Frosh created');
    void push(PATH_DASHBOARD.frosh.root);
  };

  const marksLabel = [...Array(21)].map((_, index) => {
    const value = index * 10;

    return {
      value,
      label: index % 2 ? '' : `$${value}`,
    };
  });

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
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Create Frosh
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
