import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';
import { Session } from '@supabase/supabase-js';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppStateStatus } from "react-native"
import { Alert } from 'react-native'
import { useOnlineManager } from "./hooks/useOnlineManager";
import { useAppState } from "./hooks/useAppState";
import AppLoader from "./AppLoader";
import SplashImage from "./components/common/SplashImage";
import { SessionProvider } from "./contexts/SessionContext";
import { SignInProvider } from "./contexts/SignInContext";
import { ValidSubdomains } from "./theme/subdomains";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthScreen from "./screens/AuthScreen";
import AuthAppLoader from "./AuthAppLoader";
import { db } from "./supabase/db";
import { LoggedInProfile } from "./supabase/types/extended";
import { PreferencesProvider } from "./contexts/PreferencesContext";
import AppLayout from "./layout/AppLayout";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

export default function App() {
  /********************************************************************************************************************/
  /*                                                react query                                                       */
  /********************************************************************************************************************/
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 7200, // 2 hrs
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      }
    },
  });

  const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage
  })

  const onAppStateChange = (status: AppStateStatus) => focusManager.setFocused(status === 'active')
  useAppState(onAppStateChange);
  useOnlineManager();

  /********************************************************************************************************************/
  /*                                                   auth                                                           */
  /********************************************************************************************************************/
  const [session, setSession] = useState<Session | null>();
  const [profile, setProfile] = useState<LoggedInProfile>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setProfile(null);
    });
  }, []);

  const netInfo = useNetInfo();

  const fetchProfile = async (session: Session) => {
    const userId = session.user.id;

    const key = 'Profile';
    const cachedProfile = await AsyncStorage.getItem(key);

    if (cachedProfile) {
      console.log('found profile from cache')
      setProfile(JSON.parse<LoggedInProfile>(cachedProfile));
    }

    if (!netInfo.isConnected) {
      console.log('ot connected! cant refresh')
      return;
    }

    const { data: userProfile, error: userProfileError } = await db.profile.getLoggedInProfile(userId);

    if (!userProfile || userProfileError) {
      Alert.alert(userProfileError!.message);
      return;
    }

    setProfile(userProfile);
    await AsyncStorage.setItem(key, JSON.stringify(userProfile));
  };

  useEffect(() => {
    if (session && session.user) {
      void fetchProfile(session);
    }
  }, [session]);

  /********************************************************************************************************************/
  /*                                                 render                                                           */
  /********************************************************************************************************************/

  if (session && session.user && profile) {
    return (
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
        <SessionProvider session={session} profile={profile}>
          <PreferencesProvider>
            <ThemeProvider subdomain={profile.university.subdomain as ValidSubdomains}>
              <AppLoader loadingComponent={<SplashImage/>} minimumLoadingTime={1000}>
                <AppLayout/>
              </AppLoader>
            </ThemeProvider>
          </PreferencesProvider>
        </SessionProvider>
      </PersistQueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <ThemeProvider>
          <SignInProvider>
            <AuthAppLoader loadingComponent={<SplashImage/>} minimumLoadingTime={250}>
              <AuthScreen/>
            </AuthAppLoader>
          </SignInProvider>
        </ThemeProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}
