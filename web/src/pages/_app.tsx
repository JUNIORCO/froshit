// @ts-nocheck
import '../locales/i18n';
import '../utils/highlight';
import 'simplebar/src/simplebar.css';
import 'react-image-lightbox/style.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-quill/dist/quill.snow.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import cookie from 'cookie';
import { ReactElement, ReactNode, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { getSettings } from '../utils/getSettings';
import { SettingsProvider } from '../contexts/SettingsContext';
import { CollapseDrawerProvider } from '../contexts/CollapseDrawerContext';
import ThemeProvider from '../theme';
import ThemeSettings from '../components/settings';
import { SettingsValueProps } from '../components/settings/type';
import { ChartStyle } from '../components/chart';
import ProgressBar from '../components/ProgressBar';
import NotistackProvider from '../components/NotistackProvider';
import MotionLazyContainer from '../components/animate/MotionLazyContainer';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react';
import { ProfileProvider } from '../contexts/ProfileContext';
import { SubdomainProvider } from '../contexts/SubdomainContext';
import { Analytics } from '@vercel/analytics/react';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps<{ initialSession: Session }> {
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
  subdomain: string | null;
  profile: any | null;
}

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, settings, subdomain, profile } = props;

  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width, user-scalable=no' />
      </Head>

      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <SubdomainProvider subdomain={subdomain || ''}>
          <ProfileProvider profile={profile}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CollapseDrawerProvider>
                <SettingsProvider defaultSettings={settings}>
                  <MotionLazyContainer>
                    <ThemeProvider>
                      <ThemeSettings>
                        <NotistackProvider>
                          <ChartStyle />
                          <ProgressBar />
                          {getLayout(<Component {...pageProps} />)}
                        </NotistackProvider>
                      </ThemeSettings>
                    </ThemeProvider>
                  </MotionLazyContainer>
                </SettingsProvider>
              </CollapseDrawerProvider>
            </LocalizationProvider>
          </ProfileProvider>
        </SubdomainProvider>
      </SessionContextProvider>
      <Analytics />
    </>
  );
}

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  const { subdomain } = context.ctx.query;
  const req = context.ctx.req;

  const cookies = cookie.parse(req ? req.headers.cookie || '' : document.cookie);
  const settings = getSettings(cookies);

  const profile = req?.headers.profile ? JSON.parse(req.headers.profile as string) : null;

  return {
    ...appProps,
    settings,
    subdomain,
    profile,
  };
};
