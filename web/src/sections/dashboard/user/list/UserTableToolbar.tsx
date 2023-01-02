import { InputAdornment, Stack, TextField } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import React from 'react';

type Props = {
  filterName: string;
  onFilterName: (value: string) => void;
};

export default function UserTableToolbar({
                                           filterName,
                                           onFilterName,
                                         }: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3, justifyContent: 'space-between' }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder='Search by email'
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
        sx={{
          minWidth: { sm: 200 },
          maxWidth: { sm: 400 },
        }}
      />
    </Stack>
  );
}
