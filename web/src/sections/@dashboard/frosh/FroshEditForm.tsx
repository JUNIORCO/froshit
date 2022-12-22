import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSlider, RHFTextField } from '../../../components/hook-form';
import { Frosh } from '../../../../prisma/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

type FormValuesProps = {
  name: string;
  description: string;
};

type Props = {
  currentFrosh: Frosh;
  view?: boolean;
};

export default function FroshEditForm({ currentFrosh, view }: Props) {
  const supabaseClient = useSupabaseClient();

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewTeamSchema = Yup.object().shape({
    name: Yup.string().required('Frosh name is required'),
    description: Yup.string().required('Description is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentFrosh.name,
      description: currentFrosh.description,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFrosh],
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
    if (currentFrosh) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrosh]);

  const onSubmit = async (froshToUpdate: FormValuesProps) => {
    const { error } = await supabaseClient.from('frosh').update(froshToUpdate).match({ id: currentFrosh.id });
    if (error) {
      enqueueSnackbar(`Error ${error.message}`, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Frosh updated');
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
              <RHFTextField name='name' label='Name' disabled={view}/>

              <RHFTextField name='description' label='Description' disabled={view}/>
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
