import * as Yup from 'yup';
import useSWRMutation from 'swr/mutation';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSlider, RHFTextField } from '../../../components/hook-form';

const sendFroshCreateRequest = async (url: string, { arg: frosh }: any) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(frosh),
  });
  return res.json();
};

type FormValuesProps = {
  name: string;
  description: string;
  ticketPrice: number;
};

export default function FroshNewForm() {
  const { trigger } = useSWRMutation('/api/frosh', sendFroshCreateRequest);

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewTeamSchema = Yup.object().shape({
    name: Yup.string().required('Frosh name is required'),
    description: Yup.string().required('Description is required'),
    imageUrl: Yup.string().url().required('Please upload an image'),
    ticketPrice: Yup.number().required().min(5, 'Ticket price is required'),
    universityId: Yup.number().required(),
  });

  const defaultValues = {
    name: '',
    description: '',
    imageUrl: 'https://google.com',
    ticketPrice: 100,
    universityId: 1,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewTeamSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (froshToCreate: FormValuesProps) => {
    try {
      await trigger(froshToCreate);
      reset();
      enqueueSnackbar('Create success!');
      void push(PATH_DASHBOARD.frosh.root);
    } catch (error) {
      console.error(error);
    }
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

              <Stack spacing={1} sx={{ pb: 2 }}>

                <Typography variant='subtitle1' sx={{ flexGrow: 1 }}>
                  Ticket Price
                </Typography>
                <RHFSlider
                  name='ticketPrice'
                  step={5}
                  min={0}
                  max={200}
                  marks={marksLabel}
                  getAriaValueText={(value) => `$${value}`}
                  valueLabelFormat={(value) => `$${value}`}
                  sx={{ alignSelf: 'center', width: `calc(100% - 20px)` }}
                />
              </Stack>
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
