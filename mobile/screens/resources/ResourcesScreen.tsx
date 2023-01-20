import { createStackNavigator } from '@react-navigation/stack';
import ResourcesList from "./stack/ResourcesList";
import ResourceTagsList from "./stack/ResourceTagsList";

export default function EventsScreen() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Resource Tags List"
        component={ResourceTagsList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Resources List"
        component={ResourcesList}
        options={{
          headerTitle: '',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: 'transparent',
          }
        }}
      />
    </Stack.Navigator>
  )
}
