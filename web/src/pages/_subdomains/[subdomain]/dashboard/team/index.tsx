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
import { FullTeam } from '../../../../../../prisma/api/@types';
import TeamTableRow from '../../../../../sections/dashboard/team/list/TeamTableRow';
import { TeamTableToolbar } from '../../../../../sections/dashboard/team/list';
import { Role } from '../../../../../../prisma/types';
import AuthApi from '../../../../../../prisma/api/AuthApi';
import useRefresh from '../../../../../hooks/useRefresh';
import { useSnackbar } from 'notistack';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import ConfirmDeleteModal from '../../../../../components/ConfirmDeleteModal';

const TAB_OPTIONS = ['All', 'No Leaders', 'No Froshees'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'number', label: 'Number', align: 'left' },
  { id: 'frosh', label: 'Frosh', align: 'left' },
  { id: 'leaders', label: 'Number of Leaders', align: 'left' },
  { id: 'froshees', label: 'Number of Froshees', align: 'left' },
  { id: '' },
];

TeamList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

type Props = {
  initialTeams: FullTeam[];
}

export default function TeamList({ initialTeams }: Props) {
  const [tableData, setTableData] = useState<FullTeam[]>(initialTeams);
  useEffect(() => {
    setTableData(initialTeams);
  }, [initialTeams]);

  const { push } = useRouter();
  const { refreshData } = useRefresh();
  const { enqueueSnackbar } = useSnackbar();
  const supabaseClient = useSupabaseClient();

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    setSelected,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const uniqueFroshsFromTeams = tableData.reduce((accum, { frosh }) => {
    if (!frosh || accum.includes(frosh.name)) {
      return accum;
    }
    accum.push(frosh.name);
    return accum;
  }, [] as string[]);

  const FROSH_OPTIONS: string[] = ['All', ...uniqueFroshsFromTeams];

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

  const handleViewRow = (id: string) => {
    void push(PATH_DASHBOARD.team.view(id));
  };

  const handleEditRow = (id: string) => {
    void push(PATH_DASHBOARD.team.edit(id));
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
  const [selectedTeamToDelete, setSelectedTeamToDelete] = useState<FullTeam | null>();
  const handleDeleteRow = (team: FullTeam) => {
    setSelectedTeamToDelete(team);
    toggleIsModalOpen();
  };

  const deleteEvent = async () => {
    const { error } = await supabaseClient
      .from('team')
      .delete()
      .eq('id', selectedTeamToDelete!.id);

    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }

    enqueueSnackbar(`${selectedTeamToDelete!.name} deleted`);
    setSelectedTeamToDelete(null);
    toggleIsModalOpen();
    refreshData();
  };

  return (
    <Page title='Teams'>
      <Container>
        <HeaderBreadcrumbs
          heading='Teams'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Team', href: PATH_DASHBOARD.team.root },
            { name: 'List' },
          ]}
          action={
            <Stack flexDirection='row' gap={1}>
              <Button variant='outlined' onClick={refreshData}>
                <Iconify icon={'ic:round-refresh'} width={20} height={20} />
              </Button>
              <NextLink href={PATH_DASHBOARD.team.new} passHref style={{ textDecoration: 'none' }}>
                <Button variant='contained' endIcon={<Iconify icon={'material-symbols:add-circle-outline-rounded'} />}>
                  Add Team
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

          <TeamTableToolbar
            filterName={filterName}
            filterFrosh={filterFrosh}
            onFilterName={handleFilterName}
            onFilterFrosh={handleFilterFrosh}
            optionsRole={FROSH_OPTIONS}
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
                      <TeamTableRow
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
          title={`Are you sure you want to delete ${selectedTeamToDelete?.name}?`}
          content={`Deleting ${selectedTeamToDelete?.name} will affect Leaders and Froshees within the team.`}
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
        team.profiles?.map((profile) => profile.firstName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1).find((res) => res),
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

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const api = new AuthApi({ ctx });
  const initialTeams = await api.Team.getTeamsWithFrosh();

  return {
    props: {
      initialTeams,
    },
  };
};
