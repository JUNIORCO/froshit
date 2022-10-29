import { createStackNavigator } from '@react-navigation/stack';
import EventDetails from "./stack/EventDetails";
import EventsList from "./stack/EventsList";

export default function EventsScreen() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false
      }}
    >
      <Stack.Screen name="Events List" component={EventsList} options={{ headerShown: false }}/>
      <Stack.Screen name="Event Details" component={EventDetails}/>
    </Stack.Navigator>
  )
}
