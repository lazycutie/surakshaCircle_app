import React, { useEffect } from "react"

import { AuthProvider } from "./src/context/AuthContext"
import { SocketProvider } from "./src/context/SocketContext"
import { ShakeProvider } from "./src/context/ShakeContext"

import RootNavigator from "./src/navigation/RootNavigator"

import * as Notifications from "expo-notifications"

import { registerForPushNotifications } from "./src/services/notificationService"

/*
------------------------------------------------
CONFIGURE HOW NOTIFICATIONS BEHAVE
------------------------------------------------
This controls notifications when app is open
------------------------------------------------
*/
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

/*
------------------------------------------------
MAIN APP COMPONENT
------------------------------------------------
*/

export default function App() {

  /*
  ------------------------------------------------
  INITIALIZE PUSH NOTIFICATIONS + LISTENERS
  ------------------------------------------------
  */
  useEffect(() => {

    /*
 
    /*
    ----------------------------------------
    FOREGROUND NOTIFICATION LISTENER
    ----------------------------------------
    Triggered when notification arrives
    while app is OPEN
    ----------------------------------------
    */
    const receivedListener =
      Notifications.addNotificationReceivedListener(notification => {

        console.log("🔔 Notification received (foreground):", notification)

      })

    /*
    ----------------------------------------
    USER TAPS NOTIFICATION
    ----------------------------------------
    Triggered when user clicks notification
    ----------------------------------------
    */
    const responseListener =
      Notifications.addNotificationResponseReceivedListener(response => {

        const data = response.notification.request.content.data

        console.log("📲 Notification tapped:", data)

      })

    /*
    ----------------------------------------
    CLEANUP LISTENERS
    ----------------------------------------
    */
    return () => {

      receivedListener.remove()
      responseListener.remove()

    }

  }, [])

  /*
  ------------------------------------------------
  APP PROVIDERS STRUCTURE
  ------------------------------------------------
  */

  return (

    <AuthProvider>

      <SocketProvider>

        <ShakeProvider>

          <RootNavigator />

        </ShakeProvider>

      </SocketProvider>

    </AuthProvider>

  )

}