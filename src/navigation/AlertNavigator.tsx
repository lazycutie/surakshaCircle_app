import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import AlertsScreen from "../screens/alerts/AlertsScreen"
import SentAlertsScreen from "../screens/alerts/SentAlerts"
import ReceivedAlertsScreen from "../screens/alerts/ReceivedAlerts"
import SendAlertCircleScreen from "../screens/alerts/SendAlertCircle"



/*
|--------------------------------------------------------------------------
| ALERTS NAVIGATOR
|--------------------------------------------------------------------------
| Handles navigation for:
| 1. Alerts Home
| 2. Sent Alerts
| 3. Received Alerts
| 4. Send Alert To Circle
|--------------------------------------------------------------------------
*/

const Tab = createBottomTabNavigator()

export default function AlertsNavigator() {

  return (

    <Tab.Navigator>

      {/* --------------------------------------------
          ALERTS HOME SCREEN
      -------------------------------------------- */}

      <Tab.Screen
        name="AlertsHome"
        component={AlertsScreen}
        options={{
          title:"Alerts",
          headerShown:false,

          // hide bottom tab bar
          tabBarStyle:{display:"none"}
        }}
      />



      {/* --------------------------------------------
          SENT ALERTS
      -------------------------------------------- */}

      <Tab.Screen
        name="SentAlerts"
        component={SentAlertsScreen}
        options={{
          headerShown:false,
          tabBarStyle:{display:"none"}
        }}
      />



      {/* --------------------------------------------
          RECEIVED ALERTS
      -------------------------------------------- */}

      <Tab.Screen
        name="ReceivedAlerts"
        component={ReceivedAlertsScreen}
        options={{
          headerShown:false,
          tabBarStyle:{display:"none"}
        }}
      />



      {/* --------------------------------------------
          SEND ALERT TO CIRCLE
      -------------------------------------------- */}

      <Tab.Screen
        name="SendAlertCircle"
        component={SendAlertCircleScreen}
        options={{
          headerShown:false,
          tabBarStyle:{display:"none"}
        }}
      />

    </Tab.Navigator>

  )

}