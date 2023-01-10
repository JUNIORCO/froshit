import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Stack,
  ToggleButton,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useFrosheeRegistration from '../../hooks/useFrosheeRegistration';
import { FrosheeRegistrationSteps } from './steps';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Iconify from '../Iconify';
import { Frosh } from '../../../prisma/types';
import { formatFroshPrice } from './utils';

export default function SelectFrosh() {
  const {
    university,
    setActiveStep,
    loadingPaymentIntent,
    errorMessage,
    methods,
    formPayload,
  } = useFrosheeRegistration();
  const { setValue, formState: { isValid } } = methods;

  const [expanded, setExpanded] = useState<string | false>(false);

  const isFroshSelected = (froshId: string): boolean => formPayload.frosh?.id === froshId;

  const handleFroshSelect = (frosh: Frosh) => setValue('frosh', frosh, { shouldValidate: true });

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleBack = () => setActiveStep(FrosheeRegistrationSteps.PROGRAM_AND_INTERESTS);

  return (
    <Stack spacing={3}>
      <Typography variant='h5'>Select a Frosh</Typography>

      {university.froshs.map(frosh => (
        <Accordion
          key={frosh.id}
          expanded={isFroshSelected(frosh.id) ? true : expanded === frosh.id}
          onChange={handleChange(frosh.id)}
          sx={{
            '&:before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>{frosh.name}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>{formatFroshPrice(frosh.price)}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              <Typography>{frosh.description}</Typography>
              <ToggleButton
                color='primary'
                value='check'
                selected={isFroshSelected(frosh.id)}
                onChange={() => handleFroshSelect(frosh)}
                sx={{ justifySelf: 'flex-end' }}
              >
                Select &nbsp; <Iconify icon={'eva:checkmark-circle-2-outline'} width={16} height={16} />
              </ToggleButton>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))
      }

      {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}

      <Stack flexDirection='row' gap={4}>
        <Button
          fullWidth
          size='large'
          variant='outlined'
          onClick={handleBack}
        >
          Back
        </Button>
        <LoadingButton
          fullWidth
          size='large'
          variant='contained'
          loading={loadingPaymentIntent}
          type='submit'
          role='link'
          disabled={!isValid}
        >
          Pay
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
