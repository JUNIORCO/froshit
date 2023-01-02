import React, { ReactElement, useEffect, useState } from 'react';
import { Box, Card, Container, Table, TableBody, TableContainer, TablePagination, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useTable, { emptyRows } from '../../../../../hooks/useTable';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import Scrollbar from '../../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../../components/table';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FroshsWithStats } from '../../../../../../prisma/api/@types';
import { FroshTableRow } from '../../../../../sections/dashboard/frosh/table';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import { FroshTablePageProps } from '../../../../../@types/froshs';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'numFroshees', label: 'Froshees Registered', align: 'center' },
  { id: 'numLeaders', label: 'Number of Leaders', align: 'center' },
  { id: 'numTeams', label: 'Number of Teams', align: 'center' },
  { id: 'numEvents', label: 'Number of Events', align: 'center' },
];

FroshTablePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function FroshTablePage({ initialFroshs }: FroshTablePageProps) {
  const [froshs, setFroshs] = useState<FroshsWithStats[]>(initialFroshs);

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  useEffect(() => {
    setFroshs(initialFroshs);
  }, [initialFroshs]);

  return (
    <Page title='Frosh List'>
      <Container>
        <HeaderBreadcrumbs
          heading='Frosh List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Frosh', href: PATH_DASHBOARD.froshs.root },
            { name: 'List' },
          ]}
          sx={{ mb: 2 }}
        />

        <Typography
          variant='subtitle2'
          sx={{ mb: 2 }}
        >
          Please contact FROSHIT to make changes to your Froshs.
        </Typography>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size='small' sx={{ marginTop: 1 }}>
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
                    .map((row) => (<FroshTableRow key={row.id} row={row} />))}

                  <TableEmptyRows
                    height={52}
                    emptyRows={emptyRows(page, rowsPerPage, froshs.length)}
                  />

                  <TableNoData isNotFound={!froshs.length} />
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
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps<FroshTablePageProps> = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });

  const initialFroshs = await api.Frosh.getFroshsWithStats();

  return {
    props: {
      initialFroshs,
    },
  };
};
