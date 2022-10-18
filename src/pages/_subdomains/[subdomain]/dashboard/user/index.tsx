import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
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
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useTabs from '../../../../../hooks/useTabs';
import useSettings from '../../../../../hooks/useSettings';
import useTable, { emptyRows, getComparator } from '../../../../../hooks/useTable';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';
import Scrollbar from '../../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../../../components/table';
import { UserTableRow, UserTableToolbar } from '../../../../../sections/@dashboard/user/list';
import { GetServerSideProps } from 'next';
import type { UsersForUserList } from '../../../../../../prisma/user/get';
import { getUsersForUserList } from '../../../../../../prisma/user/get';
import UserAnalytic from '../../../../../sections/@dashboard/user/UserAnalytic';
import { useTheme } from '@mui/material/styles';
import { Role } from '../../../../../../prisma/types';

const TAB_OPTIONS = ['All', 'Paid', 'Unpaid', 'Unassigned Frosh', 'Unassigned Team'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phoneNumber', label: 'Phone Number', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'froshId', label: 'Frosh', align: 'left' },
  { id: 'teamId', label: 'Team', align: 'left' },
  { id: 'paid', label: 'Paid', align: 'left' },
  { id: '' },
];

UserList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

interface UserListProps {
  users: UsersForUserList[];
}

export default function UserList({ users }: UserListProps) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const ROLE_OPTIONS = ['All', ...Object.values(Role)];

  const theme = useTheme();
  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [tableData, setTableData] = useState<UsersForUserList[]>(users);

  const [filterName, setFilterName] = useState<string>('');

  const [filterRole, setFilterRole] = useState<string>('All');

  const { currentTab: filterTab, onChangeTab: onChangeFilterTab } = useTabs('All');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value);
  };

  const handleViewRow = (id: number) => {
    void push(PATH_DASHBOARD.user.view(String(id)));
  };

  const handleDeleteRows = (selected: number[]) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id: number) => {
    void push(PATH_DASHBOARD.user.edit(String(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterTab,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterTab);

  const {
    totalValuePaid,
    numberFrosheesPaid,
    numberFrosheesUnpaid,
    totalNumberFroshees,
  } = users.reduce((accum, user) => {
    if (user.role !== Role.Froshee) return accum;

    if (user.paid) {
      accum.numberFrosheesPaid++;
      accum.totalValuePaid += user.paid;
    } else {
      accum.numberFrosheesUnpaid++;
    }

    accum.totalNumberFroshees++;
    return accum;
  }, {
    totalValuePaid: 0,
    numberFrosheesPaid: 0,
    numberFrosheesUnpaid: 0,
    totalNumberFroshees: 0,
  });

  return (
    <Page title='User List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='User List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
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
              <UserAnalytic
                title='Paid'
                total={numberFrosheesPaid}
                percent={totalNumberFroshees ? (numberFrosheesPaid / totalNumberFroshees) * 100 : 100}
                price={totalValuePaid}
                icon='eva:checkmark-circle-2-fill'
                color={theme.palette.success.main}
              />
              <UserAnalytic
                title='Unpaid'
                total={numberFrosheesUnpaid}
                percent={totalNumberFroshees ? (numberFrosheesUnpaid / totalNumberFroshees) * 100 : 100}
                price={0}
                icon='eva:alert-circle-fill'
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
            value={filterTab}
            onChange={onChangeFilterTab}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TAB_OPTIONS.map((tab) => (
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
              <Table size={dense ? 'small' : 'medium'}>
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

const applySortFilter = ({
                           tableData,
                           comparator,
                           filterName,
                           filterTab,
                           filterRole,
                         }: {
  tableData: UsersForUserList[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterTab: string;
  filterRole: string;
}): UsersForUserList[] => {
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

  if (filterTab !== 'All') {
    switch (filterTab) {
      case 'Paid':
        tableData = tableData.filter((user) => user.paid && user.role === Role.Froshee);
        break;
      case 'Unpaid':
        tableData = tableData.filter((user) => !user.paid && user.role === Role.Froshee);
        break;
      case 'Unassigned Frosh':
        // @ts-ignore
        tableData = tableData.filter((user) => [Role.Leader, Role.Froshee].includes(user.role) && user.frosh === null);
        break;
      case 'Unassigned Team':
        // @ts-ignore
        tableData = tableData.filter((user) => [Role.Leader, Role.Froshee].includes(user.role) && user.team === null);
        break;
    }
  }

  if (filterRole !== 'All') {
    tableData = tableData.filter((item) => item.role === filterRole);
  }

  return tableData;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await getUsersForUserList();

  return {
    props: {
      users,
    },
  };
};
