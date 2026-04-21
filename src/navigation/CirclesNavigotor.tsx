import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CirclesScreen from "../screens/circles/CirclesScreen"
import CreateCircle from "../screens/circles/CreateCircle"
import JoinCircle from "../screens/circles/JoinCircle"
import CircleDetail from "../screens/circles/CircleDetail"
import { CircleTabParamList } from "../types/navigationTypes";

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator<CircleTabParamList>()
export default function CirclesNavigator() {

  return (

    <Tab.Navigator>

      <Tab.Screen
        name="CircleScreen"
        component={CirclesScreen}
        options={{ title: "Circles",
          headerShown: false, 
          tabBarStyle: {display: "none"
        }}
      }

      />

      <Tab.Screen
        name="CreateCircle"
        component={CreateCircle}
        options={{
          headerShown: false,
    tabBarStyle: {display: "none"}
  }}
      />

      <Tab.Screen
        name="JoinCircle"
        component={JoinCircle}
        options={{
          headerShown: false,
    tabBarStyle: {display: "none"}
  }}
      />

      <Tab.Screen
        name="CircleDetail"
        component={CircleDetail}
        options={{
          headerShown: false,
    tabBarStyle: {display: "none"}
  }}
      />

    </Tab.Navigator>

  )

}