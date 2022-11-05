import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';
import Auth from './components/Auth';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BOTTOM_TABS from "./layout/bottomTabs";
import Logo from "./components/common/Logo";
import { focusManager, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import type { AppStateStatus } from "react-native"
import { Platform } from 'react-native'
import { useOnlineManager } from "./hooks/useOnlineManager";
import { useAppState } from "./hooks/useAppState";
import QueryKeys from "./hooks/query/QueryKeys";
import { fetchEvents } from "./api/events";
import AppLoader from "./AppLoader";
import SplashImage from "./components/common/SplashImage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 60000,
    }
  },
});

export default function App() {
  useOnlineManager();

  const onAppStateChange = (status: AppStateStatus) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active')
    }
  }
  useAppState(onAppStateChange);

  const Tab = createBottomTabNavigator();

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
          minimumLoadingTime={__DEV__ ? 1000 : 2000}
        >
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName={BOTTOM_TABS.EVENTS.name}
              screenOptions={{
                tabBarActiveTintColor: '#E91E63',
              }}>
              {Object.entries(BOTTOM_TABS).map(([tabName, options]) => (
                <Tab.Screen
                  key={tabName}
                  name={options.name}
                  component={options.component} options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name={options.icon} color={color} size={size}/>
                  ),
                  headerTitle: (props) => <Logo {...props} />,
                  // https://reactnavigation.org/docs/drawer-navigator
                  headerLeft: (props) => <MaterialCommunityIcons name='menu' color='black' size={32}
                                                                 style={{ marginLeft: 16 }} {...props}/>,
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
