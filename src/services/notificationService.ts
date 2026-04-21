import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"

/*
------------------------------------------------
REGISTER FOR PUSH NOTIFICATIONS
------------------------------------------------
Returns Expo push token
------------------------------------------------
*/

export const registerForPushNotifications = async () => {

  try {

    /*
    ----------------------------------------
    PHYSICAL DEVICE CHECK
    ----------------------------------------
    Push notifications only work on real devices
    ----------------------------------------
    */
    if (!Device.isDevice) {
      console.log("Must use physical device for notifications")
      return null
    }

    /*
    ----------------------------------------
    CHECK EXISTING PERMISSION
    ----------------------------------------
    */
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync()

    let finalStatus = existingStatus

    /*
    ----------------------------------------
    REQUEST PERMISSION IF NEEDED
    ----------------------------------------
    */
    if (existingStatus !== "granted") {

      const { status } =
        await Notifications.requestPermissionsAsync()

      finalStatus = status
    }

    /*
    ----------------------------------------
    PERMISSION DENIED
    ----------------------------------------
    */
    if (finalStatus !== "granted") {

      console.log("Notification permission not granted")
      return null
    }

    /*
    ----------------------------------------
    ANDROID CHANNEL CONFIG
    ----------------------------------------
    Required for Android notifications
    ----------------------------------------
    */
    if (Platform.OS === "android") {

      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX
      })

    }

    /*
    ----------------------------------------
    GET EXPO PUSH TOKEN
    ----------------------------------------
    */
    const token = (await Notifications.getExpoPushTokenAsync()).data

    console.log("📱 Expo Push Token:", token)

    return token

  } catch (error) {

    console.log("Push notification registration error:", error)

    return null
  }

}