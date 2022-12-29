import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Stack,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs,
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
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../../components/table';
import { UserTableRow, UserTableToolbar } from '../../../../../sections/@dashboard/user/list';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { UsersForUserList } from '../../../../../../prisma/api/@types';
import UserAnalytic from '../../../../../sections/@dashboard/user/UserAnalytic';
import { useTheme } from '@mui/material/styles';
import AuthApi from '../../../../../../prisma/api/AuthApi';

const TAB_OPTIONS = ['All', 'Unassigned Frosh', 'Unassigned Team'];

const TABLE_HEAD = [
  { id: 'firstName', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phoneNumber', label: 'Phone Number', align: 'left' },
  { id: 'froshId', label: 'Frosh', align: 'left' },
  { id: 'teamId', label: 'Team', align: 'left' },
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
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const theme = useTheme();
  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [filterName, setFilterName] = useState<string>('');

  const { currentTab: filterTab, onChangeTab: onChangeFilterTab } = useTabs('All');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleViewRow = (id: string) => {
    void push(PATH_DASHBOARD.froshees.view(id));
  };

  const handleEditRow = (id: string) => {
    void push(PATH_DASHBOARD.froshees.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData: users,
    comparator: getComparator(order, orderBy),
    filterName,
    filterTab,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterTab);

  const {
    totalValuePaid,
    totalValueUnpaid,
    numberFrosheesPaid,
    numberFrosheesUnpaid,
    totalNumberFroshees,
  } = users.reduce((accum, user) => {
    if (user.payment) {
      accum.numberFrosheesPaid++;
      accum.totalValuePaid += user.payment.amount;
    } else {
      accum.numberFrosheesUnpaid++;
      accum.totalValueUnpaid += 0;
    }

    accum.totalNumberFroshees++;
    return accum;
  }, {
    totalValuePaid: 0,
    totalValueUnpaid: 0,
    numberFrosheesPaid: 0,
    numberFrosheesUnpaid: 0,
    totalNumberFroshees: 0,
  });

  return (
    <Page title='Froshees List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Froshees List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Froshees', href: PATH_DASHBOARD.froshees.root },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.froshees.new} passHref style={{ textDecoration: 'none' }}>
              <Button variant='contained' startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Froshee
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
                price={totalValueUnpaid}
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
                      <UserTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, users.length)}
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
                         }: {
  tableData: UsersForUserList[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterTab: string;
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
      case 'Unassigned Frosh':
        // @ts-ignore
        tableData = tableData.filter((user) => user.frosh === null);
        break;
      case 'Unassigned Team':
        // @ts-ignore
        tableData = tableData.filter((user) => user.team === null);
        break;
    }
  }

  return tableData;
};

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });
  const users = await api.Profile.getProfilesForProfileList();

  return {
    props: {
      users,
    },
  };
};
