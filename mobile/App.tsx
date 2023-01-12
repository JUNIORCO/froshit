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
import HeaderLeft from "./layout/HeaderLeft";
import HeaderTitle from "./layout/HeaderTitle";
import TabBarIcon from "./layout/TabBarIcon";
import HeaderRight from "./layout/HeaderRight";
import AuthAppLoader from "./AuthAppLoader";
import { createStackNavigator } from '@react-navigation/stack';
import EmailInputScreen from "./screens/auth/EmailInputScreen";
import VerifyCodeScreen from './screens/auth/VerifyCodeScreen';
import { SessionProvider } from "./contexts/SessionContext";
import { SignInProvider } from "./contexts/SignInContext";
import { SignInScreenNames } from "./@types/navigation";

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
  const Stack = createStackNavigator();

  /********************************************************************************************************************/
  /*                                                   auth                                                           */
  /********************************************************************************************************************/
  const [session, setSession] = useState<Session | null>();
  const [profile, setProfile] = useState<Record<string, any> | null>();

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

    const { data: userProfile, error: userProfileError } = await supabase
      .from('profile')
      .select('*, team(*)')
      .eq('id', userId)
      .single();

    if (!userProfile || userProfileError) {
      Alert.alert(userProfileError!.message);
      return;
    }

    setProfile(userProfile);
  }

  useEffect(() => {
    if (session && session.user) {
      void fetchProfile(session);
    }
  }, [session])

  if (session && session.user && profile) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session} profile={profile}>
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
        </SessionProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
        <SignInProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name={SignInScreenNames.EMAIL_INPUT} component={EmailInputScreen}/>
              <Stack.Screen name={SignInScreenNames.VERIFY_CODE} component={VerifyCodeScreen}/>
            </Stack.Navigator>
          </NavigationContainer>
        </SignInProvider>
    </QueryClientProvider>
  );
}
