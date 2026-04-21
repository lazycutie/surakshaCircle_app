import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useEffect, useState } from "react"

import { savePushToken } from "../api/userApi"
import { registerForPushNotifications } from "../services/notificationService"

type AuthContextType = {
  token: string | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {}
})

export function AuthProvider({ children }: any) {

  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  /*
  -------------------------------------------------
  LOAD TOKEN ON APP START
  -------------------------------------------------
  */
  useEffect(() => {

    const loadToken = async () => {

      try {

        const storedToken = await AsyncStorage.getItem("token")

        if (storedToken) {
          setToken(storedToken)
          console.log("🔑 Token loaded")
        }

      } catch (err) {
        console.log("Error loading token:", err)
      } finally {
        setLoading(false)
      }

    }

    loadToken()

  }, [])

  /*
  -------------------------------------------------
  REGISTER PUSH TOKEN (WHEN LOGGED IN)
  -------------------------------------------------
  */
  useEffect(() => {

    /*
    ----------------------------------------
    ONLY RUN WHEN USER IS LOGGED IN
    ----------------------------------------
    */
    if (!token) return

    const setupPush = async () => {
      try { 
        const lastToken = await AsyncStorage.getItem("lastPushToken")
        const pushToken = await registerForPushNotifications()
        
        if (!pushToken || pushToken === lastToken) return

        /*
        ------------------------------------
        SEND TOKEN TO BACKEND
        ------------------------------------
        */
        await savePushToken(pushToken)
        await AsyncStorage.setItem("lastPushToken", pushToken)
        console.log("✅ Push token saved to backend")

      } catch (err) {

        console.log("Push setup error:", err)

      }

    }

    setupPush()

  }, [token])

  /*
  -------------------------------------------------
  LOGIN
  -------------------------------------------------
  */
  const login = async (token: string) => {

    try {

      await AsyncStorage.setItem("token", token)

      setToken(token)

      console.log("✅ User logged in")

    } catch (err) {

      console.log("Login error:", err)

    }

  }

  /*
  -------------------------------------------------
  LOGOUT
  -------------------------------------------------
  */
  const logout = async () => {

    try {

      await AsyncStorage.removeItem("token")

      setToken(null)

      console.log("🚪 User logged out")

    } catch (err) {

      console.log("Logout error:", err)

    }

  }

  return (

    <AuthContext.Provider
      value={{
        token,
        loading,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  )

}