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
  Switch,
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
import { GetServerSideProps } from 'next';
import { FullEvent, getFullEvents } from '../../../../../../prisma/events/get';
import dayjs from 'dayjs';
import { EventTableRow, EventTableToolbar } from '../../../../../sections/@dashboard/event/list';
import isBetween from 'dayjs/plugin/isBetween';

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
  events: FullEvent[];
}

export default function EventList({ events }: Props) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const uniqueFroshsFromEvents = events.reduce((accum, { frosh }) => {
    if (!frosh || accum.includes(frosh.name)) {
      return accum;
    }
    accum.push(frosh.name);
    return accum;
  }, [] as string[]);

  const FROSH_OPTIONS: string[] = ['All', ...uniqueFroshsFromEvents];

  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [tableData, setTableData] = useState<FullEvent[]>(events);

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

  const handleViewRow = (id: number) => {
    void push(PATH_DASHBOARD.event.view(String(id)));
  };

  const handleEditRow = (id: number) => {
    void push(PATH_DASHBOARD.event.edit(String(id)));
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
            <NextLink href={PATH_DASHBOARD.event.new} passHref>
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
                    .map((row: any) => (
                      <EventTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const events = await getFullEvents();

  return {
    props: {
      events,
    },
  };
};
