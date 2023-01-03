import React, { useEffect, useState } from 'react';
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
import useTable, { emptyRows, getComparator } from '../../../../../hooks/useTable';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';
import Scrollbar from '../../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../../components/table';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FullEvent } from '../../../../../../prisma/api/@types';
import dayjs from 'src/utils/dayjs';
import { EventTableRow, EventTableToolbar } from '../../../../../sections/dashboard/event/list';
import isBetween from 'dayjs/plugin/isBetween';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useSnackbar } from 'notistack';
import useRefresh from '../../../../../hooks/useRefresh';
import { Frosh } from 'prisma/types';
import ConfirmDeleteModal from '../../../../../components/ConfirmDeleteModal';

const TAB_OPTIONS = ['All', 'Current Events', 'Upcoming Events', 'Past Events'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'frosh', label: 'Froshs', align: 'left' },
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
  froshs: Frosh[];
}

export default function EventList({ initialEvents, froshs }: Props) {
  const { push } = useRouter();
  const { refreshData } = useRefresh();
  const { enqueueSnackbar } = useSnackbar();
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
  const supabaseClient = useSupabaseClient();

  // table data
  const [tableData, setTableData] = useState<FullEvent[]>(initialEvents);

  // filters
  const [filterName, setFilterName] = useState<string>('');
  const [filterFrosh, setFilterFrosh] = useState<string>('All');
  const { currentTab: filterTab, onChangeTab: onChangeFilterTab } = useTabs('All');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterFrosh = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFrosh(event.target.value);
    setPage(0);
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

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterFrosh) ||
    (!dataFiltered.length && !!filterTab);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toggleIsModalOpen = () => setIsModalOpen((prev) => !prev);
  const [selectedEventToDelete, setSelectedEventToDelete] = useState<FullEvent | null>();
  const handleDeleteRow = (event: FullEvent) => {
    setSelectedEventToDelete(event);
    toggleIsModalOpen();
  };

  const deleteEvent = async () => {
    const { error } = await supabaseClient
      .from('event')
      .delete()
      .eq('id', selectedEventToDelete!.id);

    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }

    enqueueSnackbar(`${selectedEventToDelete!.name} deleted`);
    setSelectedEventToDelete(null);
    toggleIsModalOpen();
    refreshData();
  };

  useEffect(() => {
    setTableData(initialEvents);
  }, [initialEvents]);

  return (
    <Page title='Event List'>
      <Container>
        <HeaderBreadcrumbs
          heading='Events'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Event', href: PATH_DASHBOARD.event.root },
            { name: 'List' },
          ]}
          action={
            <Stack flexDirection='row' gap={1}>
              <Button variant='outlined' onClick={refreshData}>
                <Iconify icon={'ic:round-refresh'} width={20} height={20} />
              </Button>
              <NextLink href={PATH_DASHBOARD.event.new} passHref style={{ textDecoration: 'none' }}>
                <Button variant='contained' endIcon={<Iconify icon={'material-symbols:add-circle-outline-rounded'} />}>
                  Add Event
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

          <EventTableToolbar
            filterName={filterName}
            filterFrosh={filterFrosh}
            onFilterName={handleFilterName}
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
                      <EventTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={52}
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

        <ConfirmDeleteModal
          open={isModalOpen}
          onClose={toggleIsModalOpen}
          onConfirm={deleteEvent}
          title={`Are you sure you want to delete ${selectedEventToDelete?.name}?`}
          content={`Deleting ${selectedEventToDelete?.name} means Froshees won't be able to see it on their device.`}
        />
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
    tableData = tableData.filter(({ froshs }) => froshs.some(frosh => frosh.name === filterFrosh));
  }

  return tableData;
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });

  const initialEvents = await api.Event.getFullEvents();
  const froshs = await api.Frosh.getFroshs();

  return {
    props: {
      initialEvents,
      froshs,
    },
  };
};
