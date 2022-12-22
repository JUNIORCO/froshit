import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Card, Container, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
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
import AuthApi from '../../../../../../prisma/api/AuthApi';
import useRefresh from '../../../../../hooks/useRefresh';
import { useSnackbar } from 'notistack';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ResourceTag } from '../../../../../../prisma/types';
import { ResourceTagTableRow, ResourceTagTableToolbar } from '../../../../../sections/@dashboard/resource-tags/list';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: '' },
];

ResourceTagsList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  initialResourceTags: ResourceTag[];
}

export default function ResourceTagsList({ initialResourceTags }: Props) {
  const [tableData, setTableData] = useState<ResourceTag[]>(initialResourceTags);

  useEffect(() => {
    setTableData(initialResourceTags);
  }, [initialResourceTags]);

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
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [filterName, setFilterName] = useState<string>('');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleViewRow = (id: string) => {
    void push(PATH_DASHBOARD.resourceTag.view(id));
  };

  const handleEditRow = (id: string) => {
    void push(PATH_DASHBOARD.resourceTag.edit(id));
  };

  const handleDeleteRow = async (id: string) => {
    const { error } = await supabaseClient.from('resource_tag').delete().eq('id', id);
    if (error) {
      console.error(error);
      enqueueSnackbar('Error deleting resource tag', { variant: 'error' });
      return;
    }
    refreshData();
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName);

  return (
    <Page title='Resource Tags List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Resource Tags List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Resource Tags', href: PATH_DASHBOARD.resourceTag.root },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.resourceTag.new} passHref style={{ textDecoration: 'none' }}>
              <Button variant='contained' startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Resource Tag
              </Button>
            </NextLink>
          }
        />

        <Card>
          <ResourceTagTableToolbar
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
                    .map((row: any) => (
                      <ResourceTagTableRow
                        key={row.id}
                        row={row}
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

// ----------------------------------------------------------------------

function applySortFilter({
                           tableData,
                           comparator,
                           filterName,
                         }: {
  tableData: ResourceTag[];
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
      (resource) =>
        resource.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    );
  }

  return tableData;
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });
  const initialResourceTags = await api.Resource.getResourceTags();

  return {
    props: {
      initialResourceTags,
    },
  };
};
