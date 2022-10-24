import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';
import Auth from './components/Auth';
import { View } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventsScreen from "./screens/events";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const TABS = {
  NOTIFICATIONS: {
    name: 'Notifications',
    icon: 'bell',
    component: EventsScreen,
  },
  TEAM: {
    name: 'Team',
    icon: 'bell',
    component: EventsScreen,
  },
  EVENTS: {
    name: 'Events',
    icon: 'bell',
    component: EventsScreen,
  },
  OFFERS: {
    name: 'Offers',
    icon: 'bell',
    component: EventsScreen,
  },
  RESOURCES: {
    name: 'Resources',
    icon: 'bell',
    component: EventsScreen,
  },
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
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
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Events"
          screenOptions={{
            tabBarActiveTintColor: '#e91e63',
          }}>
          {Object.entries(TABS).map(([tabName, options]) => (
            <Tab.Screen
              key={tabName}
              name={options.name}
              component={options.component} options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name={options.icon} color={color} size={size}/>
              ),
            }}
            />
          ))}
        </Tab.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <View>
      <Auth/>
    </View>
  );
}
