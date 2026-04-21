import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Haptics from "expo-haptics"
import { useState } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native"

import { createAlert } from "../../api/alertApi"
import { getMyCircles } from "../../api/circleApi"


/*
|--------------------------------------------------------------------------
| SHARED SOS FUNCTION
|--------------------------------------------------------------------------
| Used by:
| 1️⃣ SOS Button
| 2️⃣ Voice Distress
|--------------------------------------------------------------------------
*/

export async function triggerSOSAlert(
  latitude?: number,
  longitude?: number
) {

  try {

    if (latitude === undefined || longitude === undefined) {
      Alert.alert("Location unavailable")
      return
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)

    const saved = await AsyncStorage.getItem("alertCircles")

    const storedCircles: string[] = saved ? JSON.parse(saved) : []

    const myCircles = await getMyCircles()

    const validCircles = storedCircles.filter(id =>
      myCircles.some(c => c._id === id)
    )

    if (validCircles.length === 0) {
      Alert.alert("Please select at least one valid circle")
      return
    }

    console.log("VALID CIRCLES:", validCircles)

    const results = await Promise.allSettled(

      validCircles.map(circleId =>

        createAlert({

          latitude,
          longitude,
          alertType: "manual",
          circleId

        })

      )

    )

    const success = results.filter(r => r.status === "fulfilled")
    const failed = results.filter(r => r.status === "rejected")

    if (success.length > 0) {

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      Alert.alert("SOS Alert Sent")

    }

    if (failed.length > 0) {

      console.log("Some alerts failed:", failed)

    }

  }

  catch (error) {

    console.log("SOS ERROR:", error)

    Alert.alert("Failed to send alert")

  }

}



/*
|--------------------------------------------------------------------------
| SOS BUTTON COMPONENT
|--------------------------------------------------------------------------
*/

type Props = {
  latitude?: number
  longitude?: number
}

export default function SosButton({ latitude, longitude }: Props) {

  const [sending, setSending] = useState(false)

  const handlePress = async () => {

    if (sending) return

    setSending(true)

    await triggerSOSAlert(latitude, longitude)

    setTimeout(() => setSending(false), 5000)

  }

  return (

    <TouchableOpacity
      style={[styles.button, sending && styles.disabled]}
      onPress={handlePress}
      disabled={sending}
    >

      <Text style={styles.text}>
        {sending ? "Sending..." : "SOS"}
      </Text>

    </TouchableOpacity>

  )

}


/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({

  button: {
    backgroundColor: "red",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6
  },

  disabled: {
    opacity: 0.6
  },

  text: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold"
  }

})