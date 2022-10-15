import { useState } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs,
  Tooltip,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// hooks
import useTabs from '../../../../../hooks/useTabs';
import useSettings from '../../../../../hooks/useSettings';
import useTable, { emptyRows, getComparator } from '../../../../../hooks/useTable';
// @types
import { UserManager } from '../../../../../@types/user';
// _mock_
// layouts
import Layout from '../../../../../layouts';
// components
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';
import Scrollbar from '../../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../../../components/table';
// sections
import { UserTableRow, UserTableToolbar } from '../../../../../sections/@dashboard/user/list';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getUsersForAdminList } from '../../../../../../prisma/user/get';
import capitalize from 'lodash/capitalize';
import { getProfileRoles } from '../../../../../../prisma/roles/roles';
import InvoiceAnalytic from '../../../../../sections/@dashboard/invoice/InvoiceAnalytic';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['All', 'Paid', 'Unpaid', 'Unassigned'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phoneNumber', label: 'Phone Number', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'froshId', label: 'Frosh', align: 'left' },
  { id: 'teamId', label: 'Team', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

UserList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------
export default function UserList({ users, roles, error }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const ROLE_OPTIONS = ['All', ...roles.map((role: string) => capitalize(role))];

  const theme = useTheme();
  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [tableData, setTableData] = useState(users);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('All');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('All');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value);
  };

  const handleViewRow = (id: string) => {
    push(PATH_DASHBOARD.user.view(id));
  };

  const handleDeleteRows = (selected: string[]) => {
    const deleteRows = tableData.filter((row: any) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id: string) => {
    push(PATH_DASHBOARD.user.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  console.log(users);

  return (
    <Page title='User List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='User List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.user.new} passHref>
              <Button variant='contained' startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New User
              </Button>
            </NextLink>
          }
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction='row'
              divider={<Divider orientation='vertical' flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title='Total'
                total={10}
                percent={100}
                price={10 * 150}
                icon='ic:round-receipt'
                color={theme.palette.info.main}
              />
              <InvoiceAnalytic
                title='Paid'
                total={10 - 1}
                percent={(10 - 1) / 10 * 100}
                price={(10 - 1) * 150}
                icon='eva:checkmark-circle-2-fill'
                color={theme.palette.success.main}
              />
              <InvoiceAnalytic
                title='Unpaid'
                total={1}
                percent={1 / 10 * 100}
                price={150}
                icon='eva:clock-fill'
                color={theme.palette.warning.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant='scrollable'
            scrollButtons='auto'
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <UserTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={ROLE_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked: boolean) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row: any) => row.id),
                    )
                  }
                  actions={
                    <Tooltip title='Delete'>
                      <IconButton color='primary' onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked: boolean) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row: any) => row.id),
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
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

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label='Dense'
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
                           tableData,
                           comparator,
                           filterName,
                           filterStatus,
                           filterRole,
                         }: {
  tableData: UserManager[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterRole: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.email.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    );
  }

  if (filterStatus !== 'All') {
    tableData = tableData.filter((item: Record<string, any>) => item.status === filterStatus);
  }

  if (filterRole !== 'All') {
    tableData = tableData.filter((item: Record<string, any>) => item.role.toLowerCase() === filterRole.toLowerCase());
  }

  return tableData;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const users = await getUsersForAdminList();
  const roles = getProfileRoles();
  return {
    props: {
      users,
      roles,
    },
  };
};
