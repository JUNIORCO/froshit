import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import Iconify from '../../../../components/Iconify';

type Props = {
  optionsRole: string[];
  filterName: string;
  filterResourceTag: string;
  onFilterName: (value: string) => void;
  onFilterResourceTag: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ResourceTableToolbar({
                                               filterName,
                                               filterResourceTag,
                                               onFilterName,
                                               onFilterResourceTag,
                                               optionsRole,
                                             }: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label='Resource Tag'
        value={filterResourceTag}
        onChange={onFilterResourceTag}
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
        placeholder='Search by title'
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
