import React, { useCallback, useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  LayoutAnimation,
  UIManager,
  Platform
} from "react-native"

import { useSocket } from "../../context/SocketContext"
import { getReceivedAlerts } from "../../api/alertApi"
import { useFocusEffect } from "@react-navigation/native"

/*
------------------------------------------------
ENABLE LAYOUT ANIMATION (ANDROID FIX)
------------------------------------------------
*/
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

/*
------------------------------------------------
NORMALIZE ALERT
------------------------------------------------
*/
const normalizeAlert = (alert: any) => ({
  alertId: alert.alertId || alert._id,
  senderName: alert.senderName || alert.sendUserName || "Unknown",
  senderProfilePicture: alert.senderProfilePicture || null,
  circleName: alert.circleName || alert.circleId?.name || "Unknown Circle",
  latitude: alert.latitude || alert.location?.latitude || 0,
  longitude: alert.longitude || alert.location?.longitude || 0,
  alertType: alert.alertType || alert.type || "manual",
  createdAt: alert.createdAt,
  status: alert.status || "active"
})

/*
------------------------------------------------
RECEIVED ALERT SCREEN (FINAL)
------------------------------------------------
*/

export default function ReceivedAlertsScreen() {

  const [alerts, setAlerts] = useState<any[]>([])
  const socket = useSocket()

  /*
  ------------------------------------------------
  INITIAL LOAD (API)
  ------------------------------------------------
  */
  useFocusEffect(
    useCallback(() => {

      const loadAlerts = async () => {
        try {
          const data = await getReceivedAlerts()
          const normalized = data.map(normalizeAlert)
          setAlerts(normalized)
          console.log(alerts)
        } catch (err) {
          console.log("Failed to load alerts:", err)
        }
      }

      loadAlerts()

    }, [])
  )

  /*
  ------------------------------------------------
  SOCKET LISTENERS (REAL-TIME)
  ------------------------------------------------
  */
  useEffect(() => {

    if (!socket) return

    console.log("Socket active:", socket.connected)

    /*
    ----------------------------------------
    NEW SOS ALERT
    ----------------------------------------
    */
    const handleSOSAlert = (data: any) => {

      console.log("🚨 LIVE ALERT:", data)

      const normalized = normalizeAlert(data)

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      setAlerts(prev => {

        if (prev.some(a => a.alertId === normalized.alertId))
          return prev

        return [normalized, ...prev]
      })
    }
    /*
    ----------------------------------------
    RESOLVE ALERT
    ----------------------------------------
    */
    const handleResolved = (data: any) => {

      console.log("✅ ALERT RESOLVED:", data)

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      setAlerts(prev =>
        prev.map(alert =>
          alert.alertId === data.alertId
            ? { ...alert, status: "resolved" }
            : alert
        )
      )
    }

    /*
    ----------------------------------------
    DELETE ALERT
    ----------------------------------------
    */
    const handleDelete = (data: any) => {

      console.log("❌ ALERT DELETED:", data)

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      setAlerts(prev =>
        prev.filter(alert => alert.alertId !== data.alertId)
      )
    }

    socket.on("sos-alert", handleSOSAlert)
    socket.on("alert-resolved", handleResolved)
    socket.on("alert-deleted", handleDelete)

    return () => {
      socket.off("sos-alert", handleSOSAlert)
      socket.off("alert-resolved", handleResolved)
      socket.off("alert-deleted", handleDelete)
    }

  }, [socket])

  /*
  ------------------------------------------------
  DATE FORMAT
  ------------------------------------------------
  */
  const formatDate = (date: string) =>
    new Date(date).toLocaleString()

  /*
  ------------------------------------------------
  RENDER
  ------------------------------------------------
  */
  return (

    <View style={styles.container}>

      <FlatList
        data={alerts}
        keyExtractor={(item, index) =>
          item.alertId?.toString() || index.toString()
        }

        renderItem={({ item }) => (

          <View
  style={[
    styles.card,
    item.status === "resolved" && styles.resolvedCard
  ]}
>

            <Image
              source={{
                uri:
                  item.senderProfilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }}
              style={styles.avatar}
            />

            <View style={{ flex: 1 }}>

              <Text style={styles.title}>
                🚨 Emergency Alert
              </Text>

              <Text>Name: {item.senderName}</Text>
              <Text>Circle: {item.circleName}</Text>
              <Text>Type: {item.alertType}</Text>
              <Text>Time: {formatDate(item.createdAt)}</Text>

              {/* STATUS */}
              <Text style={{ marginTop: 5 }}>
                Status:{" "}
                {item.status === "resolved"
                  ? "✅ Resolved"
                  : "🚨 Active"}
              </Text>

            </View>

          </View>
        )}

        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            No alerts received yet
          </Text>
        )}
      />

    </View>
  )
}

/*
------------------------------------------------
STYLES
------------------------------------------------
*/

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe5e5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red"
  },

  resolvedCard: {
  backgroundColor: "#d4edda" // light green
}

})