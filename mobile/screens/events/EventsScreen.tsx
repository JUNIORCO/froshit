import { createStackNavigator } from '@react-navigation/stack';
import EventDetails from "./stack/EventDetails";
import EventsList from "./stack/EventsList";
import EventsProvider from "../../contexts/EventsContext";
import ScreenLayout from "../../layout/ScreenLayout";

export default function EventsScreen() {
  const Stack = createStackNavigator();

  return (
    <EventsProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="Events List"
          options={{ headerShown: false }}
        >
          {() =>
            <ScreenLayout
              wrapView={true}
              background={require('../../assets/images/background.png')}
              component={<EventsList/>}/>
          }
        </Stack.Screen>
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
    </EventsProvider>
  )
}
