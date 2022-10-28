import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';
import Auth from './components/Auth';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BOTTOM_TABS from "./layout/bottomTabs";
import { FetchEventsStatus, useEvents } from "./hooks/useEvents";
import AppLoader from "./AppLoader";
import Logo from "./components/common/Logo";
import SplashImage from "./components/common/SplashImage";

export default function App() {
  const Tab = createBottomTabNavigator();

  const [session, setSession] = useState<Session | null>(null);

  // processes to load before loading app
  const useEventsContext = useEvents();

  // As long as not all screens are ready, display splashscreen
  const loadingProcesses = [
    {
      name: "fetch_user_events",
      isReady: useEventsContext.eventStatus !== FetchEventsStatus.Loading
    },
  ];

  useEffect(() => {
    console.log('App mounted...')
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
      <AppLoader
        mandatoryProcesses={loadingProcesses}
        loadingComponent={<SplashImage/>}
        minimumLoadingTime={__DEV__ ? 0 : 2000}
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
                headerRight: (props) => <MaterialCommunityIcons name='menu' color='black' size={32}
                                                                style={{ marginRight: 16 }} {...props}/>,
              }}
              />
            ))}
          </Tab.Navigator>
        </NavigationContainer>
      </AppLoader>
    );
  }

  return (
    <Auth/>
  );
}
