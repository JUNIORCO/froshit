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
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { FormProvider, RHFSelect, RHFTextField } from '../../../../../components/hook-form';
import { LoadingButton } from '@mui/lab';
import useProfile from '../../../../../hooks/useProfile';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useSWRMutation from 'swr/mutation';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Scrollbar from '../../../../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../../components/table';
import useTable, { emptyRows, getComparator } from '../../../../../hooks/useTable';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import { Frosh, Profile, Role, Team } from '../../../../../../prisma/types';
import { AdminOrganizerTableRow } from '../../../../../sections/dashboard/user/list/invite';
import { getSubdomainUrl } from '../../../../../utils/url';
import useSubdomain from '../../../../../hooks/useSubdomain';
import useRefresh from '../../../../../hooks/useRefresh';
import { UserTableToolbar } from '../../../../../sections/dashboard/user/list';
import ConfirmDeleteModal from '../../../../../components/ConfirmDeleteModal';
import useUpdateEffect from '../../../../../hooks/useUpdateEffect';

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

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phoneNumber', label: 'Phone Number', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'frosh', label: 'Frosh', align: 'left' },
  { id: 'team', label: 'Team', align: 'left' },
  { id: '' },
];

UserInvite.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type FormValuesProps = {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  froshId: string | null;
};

type Props = {
  initialProfiles: (Profile & { frosh: Frosh | null, team: Team | null })[];
  froshs: Frosh[];
}

export default function UserInvite({ initialProfiles, froshs }: Props) {
  const [profiles, setProfiles] = useState<(Profile & { frosh: Frosh | null, team: Team | null })[]>(initialProfiles);
  useEffect(() => {
    setProfiles(initialProfiles);
  }, [initialProfiles]);

  const { subdomain } = useSubdomain();
  const { refreshData } = useRefresh();
  const { trigger: sendInviteAPI } = useSWRMutation('/api/user', sendInviteRequest);
  const { trigger: deleteUserAPI } = useSWRMutation('/api/user', deleteUserRequest);
  const { profile } = useProfile();
  const { enqueueSnackbar } = useSnackbar();

  const [filterName, setFilterName] = useState<string>('');

  const {
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    setPage,
    order,
    orderBy,
    onSort,
  } = useTable();

  const InviteUserSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string().nullable(),
    role: Yup.string().required('Role is required'),
    froshId: Yup.string().nullable().when('role', {
      is: Role.Leader,
      then: Yup.string().required('Frosh is required'),
    }),
  });

  const defaultValues = {
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: profile!.role === Role.Admin ? '' : Role.Leader,
    froshId: null,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(InviteUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const payload = watch();

  const onSubmit = async (userToInvite: FormValuesProps) => {
    const { error } = await sendInviteAPI({
      ...userToInvite,
      phoneNumber: userToInvite.phoneNumber === '' ? null : userToInvite.phoneNumber,
      universityId: profile?.universityId,
      redirectTo: getSubdomainUrl({ subdomain, path: PATH_AUTH.setPassword }),
    });

    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      return;
    }

    enqueueSnackbar('User invited');
    reset();
    refreshData();
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const dataFiltered = applySortFilter({
    tableData: profiles,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isNotFound = !dataFiltered.length;

  const roleOptions = profile!.role === Role.Admin ? [Role.Organizer, Role.Leader] : [Role.Leader];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toggleIsModalOpen = () => setIsModalOpen((prev) => !prev);
  const [selectedProfileToDelete, setSelectedProfileToDelete] = useState<Profile | null>();
  const handleDeleteRow = (profile: Profile) => {
    setSelectedProfileToDelete(profile);
    toggleIsModalOpen();
  };

  const deleteEvent = async () => {
    const { error } = await deleteUserAPI({ id: selectedProfileToDelete!.id });

    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }

    enqueueSnackbar(`${selectedProfileToDelete!.firstName} ${selectedProfileToDelete!.lastName} deleted`);
    setSelectedProfileToDelete(null);
    toggleIsModalOpen();
    refreshData();
  };

  useUpdateEffect(() => {
    if (payload.role === Role.Organizer) setValue('froshId', null);
    if (payload.role === Role.Leader) setValue('froshId', '');
  }, [payload.role]);

  return (
    <Page title='Invite User'>
      <Container>
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

                  <RHFTextField name='phoneNumber' label='Phone Number' />

                  <RHFTextField name='firstName' label='First Name' />

                  <RHFTextField name='lastName' label='Last Name' />

                  {profile!.role === Role.Admin && (
                    <RHFSelect name='role' label='Role' placeholder='Role'>
                      <option value='' />
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </RHFSelect>)}

                  {payload.role === Role.Leader && (
                    <RHFSelect name='froshId' label='Frosh' placeholder='Frosh'>
                      <option value='' />
                      {froshs.map((frosh) => (
                        <option key={frosh.id} value={frosh.id}>
                          {frosh.name}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                </Box>

                <Stack alignItems='flex-end' sx={{ mt: 3 }}>
                  <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                    {profile!.role === Role.Admin ? 'Invite' : 'Invite Leader'}
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

          <UserTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size='small'>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <AdminOrganizerTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={52}
                    emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
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
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Box>

          <ConfirmDeleteModal
            open={isModalOpen}
            onClose={toggleIsModalOpen}
            onConfirm={deleteEvent}
            title={`Are you sure you want to remove ${selectedProfileToDelete?.firstName} ${selectedProfileToDelete?.lastName}?`}
            content={`You'll be able to invite them again.`}
          />

        </Card>
      </Container>
    </Page>
  );
}

const applySortFilter = ({
                           tableData,
                           comparator,
                           filterName,
                         }: {
  tableData: (Profile & { frosh: Frosh | null, team: Team | null })[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}): (Profile & { frosh: Frosh | null, team: Team | null })[] => {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.email.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    );
  }

  return tableData;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });

  const [initialProfiles, froshs] = await Promise.all([
    api.Profile.getOrganizersAndLeadersOnly(),
    api.Frosh.getFroshs(),
  ]);

  return {
    props: {
      initialProfiles,
      froshs,
    },
  };
};
