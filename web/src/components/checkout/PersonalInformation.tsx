import React from 'react';
import { Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useFrosheeRegistration from '../../hooks/useFrosheeRegistration';
import { RHFTextField } from '../hook-form';
import { FrosheeRegistrationSteps } from './steps';

export default function PersonalInformation() {
  const { setActiveStep, setErrorMessage } = useFrosheeRegistration();

  const handleNextClick = async () => {
    setErrorMessage('');
    setActiveStep(FrosheeRegistrationSteps.PROGRAM_AND_INTERESTS);
  };

  return (
    <Stack spacing={3}>
      <Typography variant='h5'>Your Information</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name='firstName' label='First name' />
        <RHFTextField name='lastName' label='Last name' />
      </Stack>

      <RHFTextField name='email' label='Email address' helperText='Please use your university email' />

      <RHFTextField
        name='phoneNumber'
        label='Phone number (optional)'
        helperText='Your phone number will be used by your Leader in the event of an emergency'
      />

      <LoadingButton
        fullWidth
        size='large'
        variant='contained'
        onClick={handleNextClick}
      >
        Next
      </LoadingButton>
    </Stack>
  );
}
