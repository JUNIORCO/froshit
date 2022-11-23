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
import { FullResource } from '../../../../../../prisma/api/@types';
import { ResourceTableRow, ResourceTableToolbar } from '../../../../../sections/@dashboard/resource/list';
import AuthApi from '../../../../../../prisma/api/AuthApi';

const TAB_OPTIONS = ['All', 'No Leaders', 'No Froshees'];

const TABLE_HEAD = [
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'tag', label: 'Tag', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'phoneNumber', label: 'Phone Number', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: '' },
];

ResourceList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  resources: FullResource[];
}

export default function ResourceList({ resources }: Props) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const uniqueTags = new Set(resources.map(({ resourceTag }) => resourceTag.name));

  const RESOURCE_TAG_OPTIONS: string[] = ['All', ...uniqueTags];

  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [tableData, setTableData] = useState<FullResource[]>(resources);

  const [filterName, setFilterName] = useState<string>('');

  const [filterResourceTag, setFilterResourceTag] = useState<string>('All');

  const { currentTab: filterTab, onChangeTab: onChangeFilterTab } = useTabs('All');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterResourceTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterResourceTag(event.target.value);
  };

  const handleViewRow = (id: string) => {
    void push(PATH_DASHBOARD.resource.view(id));
  };

  const handleEditRow = (id: string) => {
    void push(PATH_DASHBOARD.resource.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterResourceTag,
    filterTab,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterResourceTag) ||
    (!dataFiltered.length && !!filterTab);

  return (
    <Page title='Resources List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Resources List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Resource', href: PATH_DASHBOARD.resource.root },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.resource.new} passHref style={{ textDecoration: 'none' }}>
              <Button variant='contained' startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Resource
              </Button>
            </NextLink>
          }
        />

        <Card>
          <ResourceTableToolbar
            filterName={filterName}
            filterResourceTag={filterResourceTag}
            onFilterName={handleFilterName}
            onFilterResourceTag={handleFilterResourceTag}
            optionsRole={RESOURCE_TAG_OPTIONS}
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
                      <ResourceTableRow
                        key={row.id}
                        row={row}
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

// ----------------------------------------------------------------------

function applySortFilter({
                           tableData,
                           comparator,
                           filterName,
                           filterTab,
                           filterResourceTag,
                         }: {
  tableData: FullResource[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterTab: string;
  filterResourceTag: string;
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
        resource.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    );
  }

  if (filterResourceTag !== 'All') {
    tableData = tableData.filter(({ resourceTag }) => resourceTag.name === filterResourceTag);
  }

  return tableData;
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });
  const resources = await api.Resource.getResources();

  return {
    props: {
      resources,
    },
  };
};
