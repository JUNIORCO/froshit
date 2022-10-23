import { Controller, useFormContext } from 'react-hook-form';
import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectProps,
} from '@mui/material';

type OptionsType = {
  label: string,
  value: string | number,
}

interface RHFMultiSelectProps extends SelectProps {
  name: string;
  label: string;
  options: OptionsType[];
}

export function RHFMultiSelect({ name, label, options, sx, ...other }: RHFMultiSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        (
          <FormControl sx={sx}>
            <InputLabel id={name}>{label}</InputLabel>
            <Select
              {...field}
              multiple
              labelId={label}
              input={<OutlinedInput label={label} error={!!error} />}
              renderValue={(selected: string[] | number[]) => selected.map((selectedId) => options.find(option => option.value === selectedId)?.label).join(', ')}
              {...other}
            >
              {options.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  <Checkbox checked={field.value.indexOf(value) > -1} />
                  {label}
                </MenuItem>
              ))}
            </Select>

            {!!error && <FormHelperText error>{error?.message} </FormHelperText>}
          </FormControl>
        )
      }
    />
  );
}
