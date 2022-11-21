// @ts-nocheck

// i18n
import '../locales/i18n';

// highlight
import '../utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

// fullcalendar
import '@fullcalendar/common/main.min.css';
import '@fullcalendar/daygrid/main.min.css';

import cookie from 'cookie';
import { ReactElement, ReactNode, useMemo, useState } from 'react';
// next
import { NextPage } from 'next';
import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
//
import { Provider as ReduxProvider } from 'react-redux';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
// redux
import { store } from '../redux/store';
// utils
import { getSettings } from '../utils/getSettings';
// contexts
import { SettingsProvider } from '../contexts/SettingsContext';
import { CollapseDrawerProvider } from '../contexts/CollapseDrawerContext';
// theme
import ThemeProvider from '../theme';
// components
import ThemeSettings from '../components/settings';
import { SettingsValueProps } from '../components/settings/type';
import { ChartStyle } from '../components/chart';
import ProgressBar from '../components/ProgressBar';
import NotistackProvider from '../components/NotistackProvider';
import MotionLazyContainer from '../components/animate/MotionLazyContainer';

// Check our docs
// https://docs-minimals.vercel.app/authentication/ts-version
// import { AuthProvider } from '../contexts/JWTContext';
// import { AuthProvider } from '../contexts/Auth0Context';
// import { AuthProvider } from '../contexts/FirebaseContext';
// import { AuthProvider } from '../contexts/AwsCognitoContext';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react';
import { ProfileProvider } from '../contexts/ProfileContext';
// ----------------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps<{ initialSession: Session }> {
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
  subdomain: string | undefined;
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
        <ProfileProvider profile={profile}>
          <ReduxProvider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CollapseDrawerProvider>
                <SettingsProvider defaultSettings={settings}>
                  <MotionLazyContainer>
                    <ThemeProvider>
                      <ThemeSettings>
                        <NotistackProvider>
                          <ChartStyle />
                          <ProgressBar />
                          {getLayout(<Component {...pageProps} subdomain={subdomain} profile={profile} />)}
                        </NotistackProvider>
                      </ThemeSettings>
                    </ThemeProvider>
                  </MotionLazyContainer>
                </SettingsProvider>
              </CollapseDrawerProvider>
            </LocalizationProvider>
          </ReduxProvider>
        </ProfileProvider>
      </SessionContextProvider>
    </>
  );
}

// ----------------------------------------------------------------------

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  const { subdomain } = context.ctx.query;

  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || '' : document.cookie,
  );

  const settings = getSettings(cookies);

  const profile = cookies.profile ? JSON.parse(cookies.profile) : null;

  return {
    ...appProps,
    settings,
    subdomain,
    profile,
  };
};
