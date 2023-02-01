import * as Yup from 'yup';
import useSWRMutation from 'swr/mutation';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { InputAttributes, NumericFormat } from 'react-number-format';
import { Box, Card, Grid, InputAdornment, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { Frosh, Team } from '../../../../prisma/types';
import useProfile from '../../../hooks/useProfile';
import { FullProfile } from '../../../../prisma/api/@types';
import { forwardRef, useMemo } from 'react';
import useUpdateEffect from '../../../hooks/useUpdateEffect';
import { fDollarToCent } from '../../../utils/formatNumber';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberFormatCustom = forwardRef<typeof NumericFormat<InputAttributes>, CustomProps>(
  function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      allowNegative={false}
      decimalScale={2}
      isAllowed={({ floatValue }) => floatValue ? floatValue < 500 : true}
    />
  );
});


const createFroshee = async (url: string, { arg }: any) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
  return res.json();
};

type FrosheeNewFormValuesProps = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  froshId: string;
  teamId: string;
  paymentAmount: string;
  program: string;
  faculty: string;
  intersts: string;
}

type FrosheeNewFormProps = {
  froshee?: FullProfile;
  froshs: Frosh[];
  teams: Team[];
  view?: boolean;
};

export default function FrosheeNewEditViewForm({ froshee, froshs, teams, view }: FrosheeNewFormProps) {
  const { profile } = useProfile();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { trigger: createFrosheeAPI } = useSWRMutation('/api/froshee', createFroshee);

  const FrosheeFormSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    froshId: Yup.string().required('Frosh is required'),
    teamId: Yup.string().required('Team is required'),
    paymentAmount: Yup.string().required('Payment amount is required'),
    program: Yup.string().required('Program is required'),
    faculty: Yup.string().required('Faculty is required'),
    interests: Yup.string(),
  });

  const defaultValues = useMemo(() => ({
      email: froshee?.email || '',
      phoneNumber: froshee?.phoneNumber || '',
      firstName: froshee?.firstName || '',
      lastName: froshee?.lastName || '',
      froshId: froshee?.froshId || '',
      teamId: froshee?.teamId || '',
      paymentAmount: froshee?.payment?.amount ? String(froshee.payment.amount / 100) : '',
      program: froshee?.program || '',
      faculty: froshee?.faculty || '',
      interests: froshee?.interests || '',
    }),
    [froshee],
  );

  const methods = useForm<FrosheeNewFormValuesProps>({
    resolver: yupResolver(FrosheeFormSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const formPayload = watch();
  const teamOptions = formPayload.froshId === '' ? [] : teams.filter(team => team.froshId === formPayload.froshId);

  const onSubmit = async (newFroshee: FrosheeNewFormValuesProps) => {
    const amountInCents = fDollarToCent(Number(newFroshee.paymentAmount));

    const { error } = await createFrosheeAPI({
      ...newFroshee,
      paymentAmount: amountInCents,
      universityId: profile!.universityId,
    });

    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Created froshee');
    void push(PATH_DASHBOARD.froshees.root);
  };

  useUpdateEffect(() => {
    setValue('teamId', '');
  }, [formPayload.froshId]);

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
              <RHFTextField name='email' label='Email Address' disabled={view || !!froshee} />

              <RHFTextField name='phoneNumber' label='Phone Number' disabled={view || !!froshee} />

              <RHFTextField name='firstName' label='First Name' disabled={view || !!froshee} />

              <RHFTextField name='lastName' label='Last Name' disabled={view || !!froshee} />

              <RHFTextField name='program' label='Program' disabled={view} />

              <RHFTextField name='faculty' label='Faculty' disabled={view} />

              <RHFTextField name='interests' label='Interests' disabled={view} />

              <RHFTextField
                name='paymentAmount'
                label='Payment Amount'
                disabled={view || !!froshee}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                  inputComponent: NumberFormatCustom as any,
                }}
              />

              <RHFSelect name='froshId' label='Frosh' placeholder='Frosh' disabled={view || !!froshee}>
                <option value='' />
                {froshs.map((frosh) => (
                  <option key={frosh.id} value={frosh.id}>
                    {frosh.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name='teamId' label='Team' placeholder='Team' disabled={view || !teamOptions.length}>
                <option value='' />
                {teamOptions.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            {!view && (<Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                {!!froshee ? 'Save Changes' : 'Add Froshee'}
              </LoadingButton>
            </Stack>)}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
