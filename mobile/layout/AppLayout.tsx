import React from "react";
import { NavigationContainer, Theme } from "@react-navigation/native";
import BOTTOM_TABS from "./BottomTabs";
import TabBarIcon from "./TabBarIcon";
import ScreenLayout from "./ScreenLayout";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import useTheme from "../hooks/useTheme";

export default function AppLayout() {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer theme={theme as unknown as Theme}>
      <Tab.Navigator
        initialRouteName={BOTTOM_TABS.EVENTS.name}
        screenOptions={{
          headerTitle: '',
          headerTransparent: true,
          lazy: false,
        }}
      >
        {Object.entries(BOTTOM_TABS).map(([tabName, options]) => (
          <Tab.Screen
            key={tabName}
            name={options.name}
            options={{
              tabBarIcon: (props) => <TabBarIcon name={options.icon} {...props}/>,
              lazy: false,
            }}>
            {() => <ScreenLayout
              wrapView={options.wrapView}
              background={options.background}
              component={<options.component/>}
            />}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
