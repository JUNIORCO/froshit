import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';
import Auth from './components/Auth';
import { View } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import BOTTOM_TABS from "./layout/bottomTabs";
import { SvgUri } from "react-native-svg";

dayjs.extend(isToday);

const Tab = createBottomTabNavigator();

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
      <SvgUri
        width="64"
        height="64"
        uri="https://firebasestorage.googleapis.com/v0/b/froshit-prod.appspot.com/o/logos%2Fhigh-res-transparent.svg?alt=media&token=1244df09-d721-41b3-86bb-e4a0f5929b6d"
      />
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
    );
  }

  return (
    <View>
      <Auth/>
    </View>
  );
}
