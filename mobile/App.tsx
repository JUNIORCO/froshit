import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';
import Auth from './components/Auth';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BOTTOM_TABS from "./layout/BottomTabs";
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppStateStatus } from "react-native"
import { Platform } from 'react-native'
import { useOnlineManager } from "./hooks/useOnlineManager";
import { useAppState } from "./hooks/useAppState";
import AppLoader from "./AppLoader";
import SplashImage from "./components/common/SplashImage";
import HeaderLeft from "./layout/HeaderLeft";
import HeaderTitle from "./layout/HeaderTitle";
import TabBarIcon from "./layout/TabBarIcon";
import HeaderRight from "./layout/HeaderRight";

export default function App() {
  /********************************************************************************************************************/
  /*                                                react query                                                       */
  /********************************************************************************************************************/
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 30 * 60000,
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
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log('App.tsx -> App mounted...')
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // TODO only for development
  if (!(session && session.user)) {
    return (
      <QueryClientProvider client={queryClient}>
        <AppLoader
          loadingComponent={<SplashImage/>}
          minimumLoadingTime={__DEV__ ? 500 : 2000}
        >
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName={BOTTOM_TABS.EVENTS.name}
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#ed1b2f'
                },
                tabBarActiveTintColor: '#ed1b2f',
                headerTitle: (props) => <HeaderTitle {...props} />,
                headerLeft: (props) => <HeaderLeft {...props}/>,
                headerRight: (props) => <HeaderRight {...props}/>,
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
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Auth/>
    </QueryClientProvider>
  );
}
