import { useSnackbar } from 'notistack';
// form
// @mui
import { Box, Card, Grid, TextField } from '@mui/material';
// hooks
// utils
// _mock
// components
import { CustomFile } from '../../../../components/upload';
import UploadAvatar from '../../../../components/upload/UploadAvatar';

// ----------------------------------------------------------------------

type FormValuesProps = {
  displayName: string;
  email: string;
  photoURL: CustomFile | string | null;
  phoneNumber: string | null;
  country: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  zipCode: string | null;
  about: string | null;
  isPublic: boolean;
};

export default function AccountGeneral({ user }: any) {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
          <UploadAvatar
            file=''
          />
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'grid',
              rowGap: 3,
              columnGap: 2,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <TextField
              disabled
              fullWidth
              value={user.name}
              label='Name'
            />
            <TextField
              disabled
              fullWidth
              value={user.email}
              label='Email'
            />
            <TextField
              disabled
              fullWidth
              value={user.phoneNumber}
              label='Phone Number'
            />
            <TextField
              disabled
              fullWidth
              value={user.role}
              label='Role'
            />
            <TextField
              disabled
              fullWidth
              value={user.interests}
              label='Interests'
            />
            <TextField
              disabled
              fullWidth
              value={user.program.name}
              label='Program'
            />
            <TextField
              disabled
              fullWidth
              value={user.frosh?.name}
              label='Frosh'
            />
            <TextField
              disabled
              fullWidth
              value={user.team?.name}
              label='Team'
            />
          </Box>

        </Card>
      </Grid>
    </Grid>
  );
}
