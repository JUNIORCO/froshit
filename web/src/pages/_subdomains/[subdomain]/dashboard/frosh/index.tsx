import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Card, Container, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import useTable, { emptyRows } from '../../../../../hooks/useTable';
import Layout from '../../../../../layouts';
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';
import Scrollbar from '../../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../../components/table';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FroshsWithStats } from '../../../../../../prisma/api/@types';
import { FroshTableRow } from '../../../../../sections/@dashboard/frosh/list';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import useRefresh from '../../../../../hooks/useRefresh';
import { useSnackbar } from 'notistack';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

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
  initialFroshs: FroshsWithStats[];
}

export default function FroshList({ initialFroshs }: Props) {
  const [froshs, setFroshs] = useState<FroshsWithStats[]>(initialFroshs);
  useEffect(() => {
    setFroshs(initialFroshs);
  }, [initialFroshs]);

  const { refreshData } = useRefresh();
  const { enqueueSnackbar } = useSnackbar();
  const supabaseClient = useSupabaseClient();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();


  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const handleViewRow = (id: string) => {
    void push(PATH_DASHBOARD.frosh.view(id));
  };

  const handleEditRow = (id: string) => {
    void push(PATH_DASHBOARD.frosh.edit(id));
  };

  const handleDeleteRow = async (id: string) => {
    const { error } = await supabaseClient.from('frosh').delete().eq('id', id);
    if (error) {
      console.error(error);
      enqueueSnackbar('Error deleting frosh', { variant: 'error' });
      return;
    }
    refreshData();
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
            <NextLink href={PATH_DASHBOARD.frosh.new} passHref style={{ textDecoration: 'none' }}>
              <Button variant='contained' startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Frosh
              </Button>
            </NextLink>
          }
        />

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
                    .map((row) => (
                      <FroshTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });
  const initialFroshs = await api.Frosh.getFroshsWithStats();

  return {
    props: {
      initialFroshs,
    },
  };
};
