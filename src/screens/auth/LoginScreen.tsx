/*
=====================================================
Login Screen
Handles user authentication
=====================================================
*/

import { useState, useContext } from "react"
import { View, TextInput, Button, StyleSheet, Alert } from "react-native"
import axios from "axios"
import { registerForPushNotifications } from "../../services/notificationService"
import { IP_ADDRESS } from "@env"

/* API */
import { loginUser } from "../../api/authApi"

/* Auth Context */
import { AuthContext } from "../../context/AuthContext"


export default function LoginScreen({ navigation }: any) {

  /*
  -------------------------------------------------
  Form State
  -------------------------------------------------
  */
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  /*
  -------------------------------------------------
  Access login function from AuthContext
  -------------------------------------------------
  */
  const { login } = useContext(AuthContext)


  /*
  -------------------------------------------------
  Handle Login
  -------------------------------------------------
  */
  const handleLogin = async () => {

    try {

      /*
      Call login API
      */
      const data = await loginUser({
        identifier,
        password
      })

      console.log("LOGIN RESPONSE:", data)

      /*
      Save token via AuthContext
      This automatically stores token + switches navigation
      */
      await login(data.token)

/*
-------------------------------------------------
GET PUSH TOKEN
-------------------------------------------------
*/
const pushToken = await registerForPushNotifications()

console.log("Push Token:", pushToken)

/*
-------------------------------------------------
SEND TOKEN TO BACKEND
-------------------------------------------------
*/
if (pushToken) {
  try {
    await axios.put(`http://${IP_ADDRESS}:5000/api/users/push-token`, {
      pushToken: pushToken,
    })

    console.log("✅ Push token saved to backend")

  } catch (error) {
    console.log("❌ Error saving push token:", error)
  }
}

    } catch (err: any) {

      console.log("LOGIN ERROR:", err.response?.data || err.message)

      Alert.alert(
        "Login Failed",
        err.response?.data?.message || "Invalid credentials"
      )

    }

  }


  /*
  -------------------------------------------------
  UI
  -------------------------------------------------
  */
  return (

    <View style={styles.container}>

      <TextInput
        placeholder="Email / Username / Phone"
        value={identifier}
        onChangeText={setIdentifier}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button
        title="Login"
        onPress={handleLogin}
      />

      <View style={{ marginTop: 10 }}>

        <Button
          title="Create Account"
          onPress={() => navigation.navigate("Register")}
        />

      </View>

    </View>

  )

}


/*
=====================================================
Styles
=====================================================
*/

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },

  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8
  }

})