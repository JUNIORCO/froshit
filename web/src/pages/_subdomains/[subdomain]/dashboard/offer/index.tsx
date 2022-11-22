import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import useTable, { emptyRows, getComparator } from '../../../../../hooks/useTable';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';
import Scrollbar from '../../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../../components/table';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Offer } from '../../../../../../prisma/types';
import { OfferTableRow, OfferTableToolbar } from '../../../../../sections/@dashboard/offer/list';
import AuthApi from '../../../../../../prisma/api/AuthApi';

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
  offers: Offer[];
}

export default function OfferList({ offers }: Props) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSelectRow,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [tableData, setTableData] = useState<Offer[]>(offers);

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

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !offers.length;

  return (
    <Page title='Offers List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Offers List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Offers', href: PATH_DASHBOARD.offer.root },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.offer.new} passHref>
              <Button variant='contained' startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Offer
              </Button>
            </NextLink>
          }
        />

        <Card>
          <OfferTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'} sx={{ paddingTop: 1 }}>
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
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, offers.length)}
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
  const offers = await api.Offer.getOffers();

  return {
    props: {
      offers,
    },
  };
};
