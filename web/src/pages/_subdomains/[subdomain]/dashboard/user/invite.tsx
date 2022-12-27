import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import { PATH_AUTH, PATH_DASHBOARD } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { FormProvider, RHFSelect, RHFTextField } from '../../../../../components/hook-form';
import { LoadingButton } from '@mui/lab';
import useProfile from '../../../../../hooks/useProfile';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useSWRMutation from 'swr/mutation';
import { GetServerSideProps } from 'next';
import Scrollbar from '../../../../../components/Scrollbar';
import { TableEmptyRows, TableNoData } from '../../../../../components/table';
import useTable, { emptyRows } from '../../../../../hooks/useTable';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import { Profile, Role } from '../../../../../../prisma/types';
import { AdminOrganizerTableRow } from '../../../../../sections/@dashboard/user/list/invite';
import { getSubdomainUrl } from '../../../../../utils/url';
import useSubdomain from '../../../../../hooks/useSubdomain';
import useRefresh from '../../../../../hooks/useRefresh';

const sendInviteRequest = async (url: string, { arg }: any) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
  return res.json();
};

const deleteUserRequest = async (url: string, { arg }: any) => {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
  return res.json();
};

UserInvite.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type FormValuesProps = {
  email: string;
  role: string;
};

type Props = {
  initialProfiles: Profile[];
}

export default function UserInvite({ initialProfiles }: Props) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  useEffect(() => {
    setProfiles(initialProfiles);
  }, [initialProfiles]);

  const { subdomain } = useSubdomain();
  const { refreshData } = useRefresh();
  const { trigger: sendInviteAPI } = useSWRMutation('/api/user', sendInviteRequest);
  const { trigger: deleteUserAPI } = useSWRMutation('/api/user', deleteUserRequest);
  const { themeStretch } = useSettings();
  const { profile } = useProfile();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const InviteUserSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    role: Yup.string().required('Role is required'),
    universityId: Yup.string().required('University is required'),
  });

  const defaultValues = {
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: profile!.role === Role.Admin ? '' : Role.Leader,
    universityId: profile?.universityId,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(InviteUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (userToInvite: FormValuesProps) => {
    const { error } = await sendInviteAPI({
      ...userToInvite,
      redirectTo: getSubdomainUrl({ subdomain, path: PATH_AUTH.setPassword }),
    });

    if (error) {
      enqueueSnackbar(`Error ${error.message}`, { variant: 'error' });
      return;
    }

    enqueueSnackbar('User invited');
    refreshData();
  };

  const handleDeleteRow = async (id: string) => {
    const { error } = await deleteUserAPI({ id });
    if (error) {
      console.error(error);
      enqueueSnackbar('Error deleting user', { variant: 'error' });
      return;
    }
    refreshData();
  };

  const {
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const isNotFound = !profiles.length;

  const roleOptions = profile!.role === Role.Admin ? [Role.Organizer, Role.Leader] : [Role.Leader];

  return (
    <Page title='Invite User'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={profile!.role === Role.Admin ? 'Invite an Organizer/Leader' : 'Invite a Leader'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Invite' },
          ]}
        />

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <RHFTextField name='email' label='Email' />

                  <RHFTextField name='firstName' label='First Name' />

                  <RHFTextField name='lastName' label='Last Name' />

                  <RHFTextField name='phoneNumber' label='Phone Number' />

                  <RHFSelect name='role' label='Role' placeholder='Role' disabled={profile!.role === Role.Organizer}>
                    <option value='' />
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>

                <Stack alignItems='flex-end' sx={{ mt: 3 }}>
                  <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                    Invite User
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>

        <Typography variant='h5' paragraph sx={{ mt: 5 }}>
          Invited Organizers & Leaders
        </Typography>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size='small'>
                <TableBody>
                  {profiles
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <AdminOrganizerTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={52}
                    emptyRows={emptyRows(page, rowsPerPage, profiles.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={profiles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Box>

        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const api = new AuthApi({ ctx });
  const initialProfiles = await api.Profile.getOrganizersAndLeadersOnly();

  return {
    props: {
      initialProfiles,
    },
  };
};
