import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import useFrosheeRegistration from '../../hooks/useFrosheeRegistration';
import { RHFTextField } from '../hook-form';
import { FrosheeRegistrationSteps } from './steps';

export default function ProgramAndInterests() {
  const { setActiveStep, setErrorMessage } = useFrosheeRegistration();

  const handleNext = async () => {
    setErrorMessage('');
    setActiveStep(FrosheeRegistrationSteps.FROSH_SELECT);
  };

  const handleBack = () => setActiveStep(FrosheeRegistrationSteps.PERSONAL_INFORMATION);

  return (
    <Stack spacing={3}>
      <Typography variant='h5'>Program and Interests</Typography>

      <RHFTextField name='program' label='Program' helperText='E.g Biomedical Engineering' />

      <RHFTextField name='faculty' label='Faculty' helperText='E.g Faculty of Engineering' />

      <RHFTextField name='interests' label='Interests' helperText='E.g Swimming, Hiking, Drawing...' />

      <Stack flexDirection='row' gap={4}>
        <Button
          fullWidth
          size='large'
          variant='outlined'
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          fullWidth
          size='large'
          variant='contained'
          onClick={handleNext}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
