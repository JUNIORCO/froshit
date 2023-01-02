import React, { ChangeEvent, ReactElement, useState } from 'react';
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
import useTable, { emptyRows, getComparator } from '../../../../../hooks/useTable';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import Scrollbar from '../../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../../components/table';
import { FrosheeTableRow, FrosheeTableToolbar } from '../../../../../sections/dashboard/froshee/table';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { UsersForUserList } from '../../../../../../prisma/api/@types';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import { PaymentType } from '../../../../../../prisma/types';
import { FrosheeTablePageProps } from '../../../../../@types/froshees';
import Iconify from '../../../../../components/Iconify';
import NextLink from 'next/link';
import useRefresh from '../../../../../hooks/useRefresh';

const TAB_OPTIONS = ['All', 'Collected In Cash'];

const TABLE_HEAD = [
  { id: 'firstName', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phoneNumber', label: 'Phone Number', align: 'left' },
  { id: 'froshId', label: 'Frosh', align: 'left' },
  { id: 'teamId', label: 'Team', align: 'left' },
  { id: 'payment', label: 'Payment', align: 'left' },
  { id: '' },
];

FrosheeTablePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function FrosheeTablePage({ users, froshs }: FrosheeTablePageProps) {
  const { refreshData } = useRefresh();
  const { push } = useRouter();
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [filterName, setFilterName] = useState<string>('');
  const [filterFrosh, setFilterFrosh] = useState<string>('All');
  const { currentTab: filterTab, onChangeTab: onChangeFilterTab } = useTabs('All');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterFrosh = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterFrosh(event.target.value);
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
    filterFrosh,
  });

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterTab);

  return (
    <Page title='Froshees'>
      <Container>
        <HeaderBreadcrumbs
          heading='Froshees'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Froshees', href: PATH_DASHBOARD.froshees.root },
            { name: 'List' },
          ]}
          action={
            <Stack flexDirection='row' gap={1}>
              <Button variant='outlined' onClick={refreshData}>
                <Iconify icon={'ic:round-refresh'} width={20} height={20} />
              </Button>
              <NextLink href={PATH_DASHBOARD.froshees.new} passHref style={{ textDecoration: 'none' }}>
                <Button variant='contained' endIcon={<Iconify icon={'material-symbols:add-circle-outline-rounded'} />}>
                  Add Froshee
                </Button>
              </NextLink>
            </Stack>
          }
        />

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

          <FrosheeTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            filterFrosh={filterFrosh}
            onFilterFrosh={handleFilterFrosh}
            froshs={froshs}
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
                      <FrosheeTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={52}
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
                           filterFrosh,
                         }: {
  tableData: UsersForUserList[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterTab: string;
  filterFrosh: string;
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
      case 'Collected In Cash':
        tableData = tableData.filter((user) => user.payment?.type === PaymentType.Cash);
        break;
    }
  }

  if (filterFrosh !== 'All') {
    tableData = tableData.filter(({ frosh }) => frosh ? frosh.name === filterFrosh : true);
  }

  return tableData;
};

export const getServerSideProps: GetServerSideProps<FrosheeTablePageProps> = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });

  const users = await api.Profile.getProfilesForProfileList();
  const froshs = await api.Frosh.getFroshs();

  return {
    props: {
      users,
      froshs,
    },
  };
};
