import { createStackNavigator } from '@react-navigation/stack';
import ResourcesList from "./stack/ResourcesList";
import ResourceTagsList from "./stack/ResourceTagsList";
import ScreenLayout from "../../layout/ScreenLayout";

export default function EventsScreen() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Resource Tags List"
        options={{ headerShown: false }}
      >{() =>
        <ScreenLayout
          wrapView={true}
          background={require('../../assets/images/background.png')}
          component={<ResourceTagsList/>}/>
      }</Stack.Screen>
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
