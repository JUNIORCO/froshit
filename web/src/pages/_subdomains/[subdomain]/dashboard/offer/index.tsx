import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Card, Container, Stack, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useTable, { emptyRows, getComparator } from '../../../../../hooks/useTable';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';
import Scrollbar from '../../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../../components/table';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Offer } from '../../../../../../prisma/types';
import { OfferTableRow, OfferTableToolbar } from '../../../../../sections/dashboard/offer/list';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import useRefresh from '../../../../../hooks/useRefresh';
import { useSnackbar } from 'notistack';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const TABLE_HEAD = [
  { id: 'provider', label: 'Provider', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'location', label: 'Location', align: 'left' },
  { id: '' },
];

OfferList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  initialOffers: Offer[];
}

export default function OfferList({ initialOffers }: Props) {
  const [tableData, setTableData] = useState<Offer[]>(initialOffers);
  useEffect(() => {
    setTableData(initialOffers);
  }, [initialOffers]);

  const { refreshData } = useRefresh();
  const { enqueueSnackbar } = useSnackbar();
  const supabaseClient = useSupabaseClient();
  const { push } = useRouter();
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

  const [filterName, setFilterName] = useState<string>('');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleViewRow = (id: string) => {
    void push(PATH_DASHBOARD.offer.view(id));
  };

  const handleEditRow = (id: string) => {
    void push(PATH_DASHBOARD.offer.edit(id));
  };

  const handleDeleteRow = async (id: string) => {
    const { error } = await supabaseClient.from('offer').delete().eq('id', id);
    if (error) {
      console.error(error);
      enqueueSnackbar('Error deleting offer', { variant: 'error' });
      return;
    }
    refreshData();
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  return (
    <Page title='Offers'>
      <Container>
        <HeaderBreadcrumbs
          heading='Offers List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Offers', href: PATH_DASHBOARD.offer.root },
            { name: 'List' },
          ]}
          action={
            <Stack flexDirection='row' gap={1}>
              <Button variant='outlined' onClick={refreshData}>
                <Iconify icon={'ic:round-refresh'} width={20} height={20} />
              </Button>
              <NextLink href={PATH_DASHBOARD.offer.new} passHref style={{ textDecoration: 'none' }}>
                <Button variant='contained' endIcon={<Iconify icon={'material-symbols:add-circle-outline-rounded'} />}>
                  Add Offer
                </Button>
              </NextLink>
            </Stack>
          }
        />

        <Card>
          <OfferTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size='small' sx={{ paddingTop: 1 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                  sx={{ paddingTop: 1 }}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <OfferTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={52}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={!tableData.length} />
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
                         }: {
  tableData: Offer[];
  comparator: (a: any, b: any) => number;
  filterName: string;
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
      (offer) =>
        // @ts-ignore
        offer.provider.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    );
  }

  return tableData;
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });

  const initialOffers = await api.Offer.getOffers();

  return {
    props: {
      initialOffers,
    },
  };
};
