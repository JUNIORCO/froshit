import { Controller, useFormContext } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import React from 'react';
import { TextField } from '@mui/material';

type IProps = {
  name: string;
  children: React.ReactNode;
};

// type Props = IProps & DateTimePickerProps;

export default function RHFDateTimeRangeSelect({ name, children, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DateTimePicker
              {...field}
              renderInput={(params) =>
                <TextField {...params}
                           fullWidth
                           value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
                           error={!!error}
                           helperText={error?.message}
                />
              }
              {...other}
            />
          </Stack>
        </LocalizationProvider>
      )}
    />
  );
}
