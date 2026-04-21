import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import CirclesNavigator from "./CirclesNavigotor"
import AlertsNavigator from "./AlertNavigator"
import { MainTabParamList } from "../types/navigationTypes"
import UserNavigator from "./userNavigaotor"
import DashboardNavigator from "./DashboardNavigator"

const Tab = createBottomTabNavigator<MainTabParamList>()

export default function MainNavigator() {
  return (
    <Tab.Navigator>

      <Tab.Screen
  name="Dashboard"
  component={DashboardNavigator}
  options={{headerShown: false,}}
/>

      <Tab.Screen
        name="Circles"
        component={CirclesNavigator}
                 options={{
        headerShown: false,}}
      />
      
      <Tab.Screen
        name="Alerts"
        component={AlertsNavigator}
                 options={{
        headerShown: false,}}
      />

      <Tab.Screen
        name="ProfileScreens"
        component={UserNavigator}
                 options={{
        headerShown: false,}}
      />

    </Tab.Navigator>
  )
}