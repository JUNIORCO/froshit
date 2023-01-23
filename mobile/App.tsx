import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';
import { Session } from '@supabase/supabase-js';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

export default function App() {
  /********************************************************************************************************************/
  /*                                                react query                                                       */
  /********************************************************************************************************************/
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 86400, // 24 hrs
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      }
    },
  });

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
    });
  }, []);

  const fetchProfile = async (session: Session) => {
    const userId = session.user.id;

    const { data: userProfile, error: userProfileError } = await db.profile.getLoggedInProfile(userId);

    if (!userProfile || userProfileError) {
      Alert.alert(userProfileError!.message);
      return;
    }

    setProfile(userProfile);
  };

  useEffect(() => {
    if (session && session.user) {
      void fetchProfile(session);
    }
  }, [session])

  /********************************************************************************************************************/
  /*                                                 render                                                           */
  /********************************************************************************************************************/

  if (session && session.user && profile) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session} profile={profile}>
          <PreferencesProvider>
            <ThemeProvider subdomain={profile.university.subdomain as ValidSubdomains}>
              <AppLoader loadingComponent={<SplashImage/>} minimumLoadingTime={1000}>
                <AppLayout/>
              </AppLoader>
            </ThemeProvider>
          </PreferencesProvider>
        </SessionProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <ThemeProvider>
          <SignInProvider>
            <AuthAppLoader loadingComponent={<SplashImage/>} minimumLoadingTime={500}>
              <AuthScreen/>
            </AuthAppLoader>
          </SignInProvider>
        </ThemeProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}
