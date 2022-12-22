import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
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
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FullEvent } from '../../../../../../prisma/api/@types';
import dayjs from 'dayjs';
import { EventTableRow, EventTableToolbar } from '../../../../../sections/@dashboard/event/list';
import isBetween from 'dayjs/plugin/isBetween';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useSnackbar } from 'notistack';
import useRefresh from '../../../../../hooks/useRefresh';

dayjs.extend(isBetween);

const TAB_OPTIONS = ['All', 'Current Events', 'Upcoming Events', 'Past Events'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'frosh', label: 'Frosh', align: 'left' },
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'location', label: 'Location', align: 'left' },
  { id: '' },
];

EventList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  initialEvents: FullEvent[];
}

export default function EventList({ initialEvents }: Props) {
  const [tableData, setTableData] = useState<FullEvent[]>(initialEvents);
  useEffect(() => {
    setTableData(initialEvents);
  }, [initialEvents]);

  const { refreshData } = useRefresh();
  const { enqueueSnackbar } = useSnackbar();
  const supabaseClient = useSupabaseClient();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const uniqueFroshsFromEvents = tableData.reduce((accum, { frosh }) => {
    if (!frosh || accum.includes(frosh.name)) {
      return accum;
    }
    accum.push(frosh.name);
    return accum;
  }, [] as string[]);

  const FROSH_OPTIONS: string[] = ['All', ...uniqueFroshsFromEvents];

  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [filterName, setFilterName] = useState<string>('');

  const [filterFrosh, setFilterFrosh] = useState<string>('All');

  const { currentTab: filterTab, onChangeTab: onChangeFilterTab } = useTabs('All');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterFrosh = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFrosh(event.target.value);
  };

  const handleViewRow = (id: string) => {
    void push(PATH_DASHBOARD.event.view(id));
  };

  const handleEditRow = (id: string) => {
    void push(PATH_DASHBOARD.event.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterFrosh,
    filterTab,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterFrosh) ||
    (!dataFiltered.length && !!filterTab);

  const handleDeleteRow = async (id: string) => {
    const { error } = await supabaseClient.from('event').delete().eq('id', id);
    if (error) {
      console.error(error);
      enqueueSnackbar('Error deleting event', { variant: 'error' });
      return;
    }
    refreshData();
  };

  return (
    <Page title='Event List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Event List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Event', href: PATH_DASHBOARD.event.root },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.event.new} passHref style={{ textDecoration: 'none' }}>
              <Button variant='contained' startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Event
              </Button>
            </NextLink>
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

          <EventTableToolbar
            filterName={filterName}
            filterFrosh={filterFrosh}
            onFilterName={handleFilterName}
            onFilterFrosh={handleFilterFrosh}
            optionsRole={FROSH_OPTIONS}
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
                    .map((row: any) => (
                      <EventTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

function applySortFilter({
                           tableData,
                           comparator,
                           filterName,
                           filterTab,
                           filterFrosh,
                         }: {
  tableData: FullEvent[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterTab: string;
  filterFrosh: string;
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
      ({ name }) => name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    );
  }

  if (filterTab !== 'All') {
    switch (filterTab) {
      case 'Current Events':
        tableData = tableData.filter(({ startDate, endDate }) => dayjs().isBetween(startDate, endDate));
        break;
      case 'Upcoming Events':
        tableData = tableData.filter(({ startDate }) => dayjs(startDate).isAfter(dayjs()));
        break;
      case 'Past Events':
        tableData = tableData.filter(({ endDate }) => dayjs(endDate).isBefore(dayjs()));
        break;
    }
  }

  if (filterFrosh !== 'All') {
    tableData = tableData.filter(({ frosh }) => frosh.name === filterFrosh || false);
  }

  return tableData;
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });
  const initialEvents = await api.Event.getFullEvents();

  return {
    props: {
      initialEvents,
    },
  };
};
