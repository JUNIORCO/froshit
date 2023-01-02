import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import React, { ChangeEvent } from 'react';
import { Frosh } from '../../../../../prisma/types';

type Props = {
  filterName: string;
  onFilterName: (value: string) => void;
  filterFrosh: string;
  onFilterFrosh: (event: ChangeEvent<HTMLInputElement>) => void;
  froshs: Frosh[];
};

export default function FrosheeTableToolbar({
                                              filterName,
                                              onFilterName,
                                              filterFrosh,
                                              onFilterFrosh,
                                              froshs,
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
        sx={{ maxWidth: { sm: 240 } }}
      >
        <MenuItem
          key='All'
          value='All'
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 0.75,
            typography: 'body2',
          }}
        >
          All
        </MenuItem>
        {froshs.map((frosh) => (
          <MenuItem
            key={frosh.name}
            value={frosh.name}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
            }}
          >
            {frosh.name}
          </MenuItem>
        ))}
      </TextField>

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
      />
    </Stack>
  );
}
