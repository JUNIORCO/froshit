import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import React from 'react';

// ----------------------------------------------------------------------

type Props = {
  optionsRole: string[];
  filterName: string;
  filterFrosh: string;
  onFilterName: (value: string) => void;
  onFilterFrosh: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FroshTableToolbar({
                                           filterName,
                                           filterFrosh,
                                           onFilterName,
                                           onFilterFrosh,
                                           optionsRole,
                                         }: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label='Frosh'
        value={filterFrosh}
        onChange={onFilterFrosh}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsRole.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder='Search by Leader or Froshee name'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
