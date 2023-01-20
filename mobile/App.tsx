import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BOTTOM_TABS from "./layout/BottomTabs";
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppStateStatus } from "react-native"
import { Alert, Platform } from 'react-native'
import { useOnlineManager } from "./hooks/useOnlineManager";
import { useAppState } from "./hooks/useAppState";
import AppLoader from "./AppLoader";
import SplashImage from "./components/common/SplashImage";
import TabBarIcon from "./layout/TabBarIcon";
import { SessionProvider } from "./contexts/SessionContext";
import { SignInProvider } from "./contexts/SignInContext";
import { SUBDOMAIN_COLOR_PALETTE } from "./theme/subdomain-color-palette";
import { ValidSubdomains } from "./theme/subdomains";
import { ThemeProvider } from "./theme/theme";
import AuthScreen from "./screens/AuthScreen";
import AuthAppLoader from "./AuthAppLoader";
import { db } from "./supabase/db";
import { LoggedInProfile } from "./supabase/database.types";

export default function App() {
  /********************************************************************************************************************/
  /*                                                react query                                                       */
  /********************************************************************************************************************/
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 30 * 60000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      }
    },
  });

  const onAppStateChange = (status: AppStateStatus) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active')
    }
  }

  useAppState(onAppStateChange);
  useOnlineManager();

  /********************************************************************************************************************/
  /*                                                navigators                                                        */
  /********************************************************************************************************************/
  const Tab = createBottomTabNavigator();

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

    // @ts-ignore
    setProfile(userProfile);
  };

  useEffect(() => {
    if (session && session.user) {
      void fetchProfile(session);
    }
  }, [session])

  /********************************************************************************************************************/
  /*                                                  theme                                                           */
  /********************************************************************************************************************/
  const getColor = () => {
    return profile && profile.university ? SUBDOMAIN_COLOR_PALETTE[profile.university.subdomain as ValidSubdomains].main : '#5D5EE2';
  }

  if (session && session.user && profile) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session} profile={profile}>
          <ThemeProvider>
            <AppLoader
              loadingComponent={<SplashImage/>}
              minimumLoadingTime={1000}
            >
              <NavigationContainer>
                <Tab.Navigator
                  initialRouteName={BOTTOM_TABS.EVENTS.name}
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: getColor(),
                    },
                    headerShown: false,
                    tabBarActiveTintColor: getColor(),
                    lazy: false,
                  }}
                >
                  {Object.entries(BOTTOM_TABS).map(([tabName, options]) => (
                    <Tab.Screen
                      key={tabName}
                      name={options.name}
                      component={options.component}
                      options={{
                        tabBarIcon: (props) => <TabBarIcon name={options.icon} {...props}/>,
                      }}
                    />
                  ))}
                </Tab.Navigator>
              </NavigationContainer>
            </AppLoader>
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SignInProvider>
          <AuthAppLoader
            loadingComponent={<SplashImage/>}
            minimumLoadingTime={1000}
          >
            <AuthScreen/>
          </AuthAppLoader>
        </SignInProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
