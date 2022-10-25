import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';
import Auth from './components/Auth';
import { View, Image } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventsScreen from "./screens/events";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TABS = {
  NOTIFICATIONS: {
    name: 'Notifications',
    icon: 'bell-outline',
    component: EventsScreen,
  },
  TEAM: {
    name: 'Team',
    icon: 'account-group-outline',
    component: EventsScreen,
  },
  EVENTS: {
    name: 'Events',
    icon: 'calendar-blank-outline',
    component: EventsScreen,
  },
  OFFERS: {
    name: 'Offers',
    icon: 'tag',
    component: EventsScreen,
  },
  RESOURCES: {
    name: 'Resources',
    icon: 'help-circle-outline',
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

  useEffect(() => {
    // TODO only for development
    if (!(session && session.user)) {
      console.log('fetching data...')
    }
  }, [session]);

  function Logo() {
    return (
      <MaterialCommunityIcons name='bell' color='black' size={32}/>
    );
  }

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
              headerTitle: (props) => <Logo {...props} />,
              headerRight: (props) => <MaterialCommunityIcons name='menu' color='black' size={32} style={{ marginRight: 16 }} {...props}/>,
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
