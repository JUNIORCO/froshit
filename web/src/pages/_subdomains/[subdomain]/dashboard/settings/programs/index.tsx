import React from 'react';
import { Container, Typography } from '@mui/material';
import useSettings from '../../../../../../hooks/useSettings';
import Layout from '../../../../../../layouts';
import Page from '../../../../../../components/Page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

ProgramsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function ProgramsPage() {
  const { themeStretch } = useSettings();

  return (
    <Page title='University Identity'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography>University Identity</Typography>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {},
  };
};
