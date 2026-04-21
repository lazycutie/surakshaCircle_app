import { createNativeStackNavigator } from "@react-navigation/native-stack"

import DashboardScreen from "../screens/dashboard/DashboardScreen"
import FakeCallScreen from "../screens/dashboard/FakeCallScreen"

const Stack = createNativeStackNavigator()

export default function DashboardNavigator() {

  return (

    <Stack.Navigator>

      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FakeCall"
        component={FakeCallScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal"
        }}
      />

    </Stack.Navigator>

  )

}