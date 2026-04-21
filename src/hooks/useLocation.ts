import { useEffect, useRef, useState } from "react"
import * as Location from "expo-location"

export default function useLocation() {

  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null)

  useEffect(() => {

    const startTracking = async () => {

      try {

        console.log("📍 Requesting location permission...")

        const { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== "granted") {
          console.log("❌ Location permission denied")
          return
        }

        console.log("✅ Permission granted")

        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 3000,
            distanceInterval: 5
          },

          (loc) => {

            const coords = loc.coords

            console.log("📍 LOCATION:", coords.latitude, coords.longitude)

            setLocation({
              latitude: coords.latitude,
              longitude: coords.longitude
            })

          }
        )

      } catch (err) {

        console.log("❌ Location error:", err)

      }

    }

    startTracking()

    return () => {

      if (subscriptionRef.current) {
        subscriptionRef.current.remove()
      }

    }

  }, [])

  return location
}