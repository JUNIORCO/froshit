import React from 'react';
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
import useTable, { emptyRows } from '../../../../../hooks/useTable';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';
import Scrollbar from '../../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../../components/table';
import { GetServerSideProps } from 'next';
import { FroshsWithStats, getFroshsWithStats } from '../../../../../../prisma/froshs/get';
import { FroshTableRow } from '../../../../../sections/@dashboard/frosh/list';

const TAB_OPTIONS = ['All', 'No Leaders', 'No Froshees'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'ticketPrice', label: 'Ticket Price', align: 'center' },
  { id: 'frosheesPaid', label: 'Froshees Paid', align: 'center' },
  { id: 'numFroshees', label: 'Froshees Registered', align: 'center' },
  { id: 'numLeaders', label: 'Number of Leaders', align: 'center' },
  { id: 'numTeams', label: 'Number of Teams', align: 'center' },
  { id: 'numEvents', label: 'Number of Events', align: 'center' },
  { id: '' },
];

FroshList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  froshs: FroshsWithStats[];
}

export default function FroshList({ froshs }: Props) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();


  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const handleViewRow = (id: number) => {
    void push(PATH_DASHBOARD.frosh.view(String(id)));
  };

  const handleEditRow = (id: number) => {
    void push(PATH_DASHBOARD.frosh.edit(String(id)));
  };

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !froshs.length;

  return (
    <Page title='Frosh List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Frosh List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Frosh', href: PATH_DASHBOARD.frosh.root },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.frosh.new} passHref>
              <Button variant='contained' startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Frosh
              </Button>
            </NextLink>
          }
        />

        <Card>
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
                  {froshs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <FroshTableRow
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
                    emptyRows={emptyRows(page, rowsPerPage, froshs.length)}
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
              count={froshs.length}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const froshs = await getFroshsWithStats();

  return {
    props: {
      froshs,
    },
  };
};
