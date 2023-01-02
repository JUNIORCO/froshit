import { useState } from 'react';
import { Box, Card, CardHeader, Container, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import Layout from '../../../../layouts';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';

PermissionDenied.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function PermissionDenied() {
  const [role, setRole] = useState('admin');

  const handleChangeRole = (event: React.MouseEvent<HTMLElement>, newRole: string | null) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  return (
    <Page title='Permission Denied'>
      <Container>
        <HeaderBreadcrumbs
          heading='Permission Denied'
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Permission Denied' },
          ]}
        />

        <ToggleButtonGroup
          exclusive
          value={role}
          onChange={handleChangeRole}
          color='primary'
          sx={{ mb: 5 }}
        >
          <ToggleButton value='admin' aria-label='admin role'>
            isAdmin
          </ToggleButton>

          <ToggleButton value='user' aria-label='user role'>
            isUser
          </ToggleButton>
        </ToggleButtonGroup>

        <RoleBasedGuard hasContent roles={[role]}>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {[...Array(8)].map((_, index) => (
              <Card key={index}>
                <CardHeader title={`Card ${index + 1}`} subheader='Proin viverra ligula' />

                <Typography sx={{ p: 3, color: 'text.secondary' }}>
                  Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. In enim justo,
                  rhoncus ut, imperdiet a, venenatis vitae, justo. Vestibulum fringilla pede sit
                  amet augue.
                </Typography>
              </Card>
            ))}
          </Box>
        </RoleBasedGuard>
      </Container>
    </Page>
  );
}
