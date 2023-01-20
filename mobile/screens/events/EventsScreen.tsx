import { createStackNavigator } from '@react-navigation/stack';
import EventDetails from "./stack/EventDetails";
import EventsList from "./stack/EventsList";

export default function EventsScreen() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Events List"
        component={EventsList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Event Details"
        component={EventDetails}
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
