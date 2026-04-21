import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useContext } from "react"

import { AuthContext } from "../context/AuthContext"

import AuthNavigator from "./AuthNavigator"
import MainNavigator from "./MainNavigator"

const Stack = createNativeStackNavigator()

export default function RootNavigator() {

  const { token, loading } = useContext(AuthContext)

  if (loading) {
    return null
  }

  return (

    <NavigationContainer>

      <Stack.Navigator screenOptions={{ headerShown:false }}>

        {token ? (

          <Stack.Screen
            name="App"
            component={MainNavigator}
          />

        ) : (

          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
          />

        )}

      </Stack.Navigator>

    </NavigationContainer>

  )

}