import { createNativeStackNavigator } from "@react-navigation/native-stack"

import ProfileScreen from "../screens/profile/ProfileScreen"
import EditProfileScreen from "../screens/profile/EditProfile"
import ChangePasswordScreen from "../screens/profile/ChangePassword"

const Stack = createNativeStackNavigator()

export default function ProfileStack() {

  return (

    <Stack.Navigator>

      {/* Main profile page */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />

      {/* Edit profile screen */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />

      {/* Change password screen */}
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: "Change Password" }}
      />

    </Stack.Navigator>

  )

}