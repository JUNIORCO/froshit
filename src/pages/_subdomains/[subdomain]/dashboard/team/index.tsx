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
  IconButton,
  Switch,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs,
  Tooltip,
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
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../../../components/table';
import { GetServerSideProps } from 'next';
import { FullTeam, getTeamsWithFrosh } from '../../../../../../prisma/team/get';
import TeamTableRow from '../../../../../sections/@dashboard/team/list/TeamTableRow';
import { TeamTableToolbar } from '../../../../../sections/@dashboard/team/list';
import { Role } from '../../../../../../prisma/types';

const TAB_OPTIONS = ['All', 'No Leaders', 'No Froshees'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'frosh', label: 'Frosh', align: 'left' },
  { id: 'leaders', label: 'Leaders', align: 'left' },
  { id: 'froshees', label: 'Froshees', align: 'left' },
  { id: '' },
];

TeamList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  teams: FullTeam[];
}

export default function TeamList({ teams }: Props) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const uniqueFroshsFromTeams = teams.reduce((accum, { frosh }) => {
    if (!frosh || accum.includes(frosh.name)) {
      return accum;
    }
    accum.push(frosh.name);
    return accum;
  }, [] as string[]);

  const FROSH_OPTIONS: string[] = ['All', ...uniqueFroshsFromTeams];

  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [tableData, setTableData] = useState<FullTeam[]>(teams);

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
    void push(PATH_DASHBOARD.team.view(String(id)));
  };

  const handleDeleteRows = (selected: number[]) => {
    const deleteRows = tableData.filter((row: any) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id: number) => {
    void push(PATH_DASHBOARD.team.edit(String(id)));
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
    <Page title='Team List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Team List'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Team', href: PATH_DASHBOARD.team.root },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.team.new} passHref>
              <Button variant='contained' startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Team
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

          <TeamTableToolbar
            filterName={filterName}
            filterFrosh={filterFrosh}
            onFilterName={handleFilterName}
            onFilterFrosh={handleFilterFrosh}
            optionsRole={FROSH_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked: boolean) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row: any) => row.id),
                    )
                  }
                  actions={
                    <Tooltip title='Delete'>
                      <IconButton color='primary' onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

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
                      <TeamTableRow
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
                           filterFrosh,
                         }: {
  tableData: FullTeam[];
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
      (team) =>
        // @ts-ignore
        team.profiles.map((profile) => profile.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1).find((res) => res),
    );
  }

  if (filterTab !== 'All') {
    switch (filterTab) {
      case 'No Leaders':
        tableData = tableData.filter(({ profiles }) => !profiles?.find((member) => member.role === Role.Leader) || false);
        break;
      case 'No Froshees':
        tableData = tableData.filter(({ profiles }) => !profiles?.find((member) => member.role === Role.Froshee) || false);
        break;
    }
  }

  if (filterFrosh !== 'All') {
    tableData = tableData.filter(({ frosh }) => frosh?.name === filterFrosh || false);
  }

  return tableData;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const teams = await getTeamsWithFrosh();

  return {
    props: {
      teams,
    },
  };
};
