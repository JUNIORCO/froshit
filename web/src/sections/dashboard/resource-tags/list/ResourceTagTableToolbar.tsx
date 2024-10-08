import { InputAdornment, Stack, TextField } from '@mui/material';
import Iconify from '../../../../components/Iconify';

type Props = {
  filterName: string;
  onFilterName: (value: string) => void;
};

export default function ResourceTagTableToolbar({
                                                  filterName,
                                                  onFilterName,
                                                }: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder='Search by name'
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
