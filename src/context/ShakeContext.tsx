import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Haptics from "expo-haptics"
import { Accelerometer } from "expo-sensors"
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { createAlert } from "../api/alertApi"
import { getMyCircles } from "../api/circleApi"
import useLocation from "../hooks/useLocation"
 
const SHAKE_FORCE_THRESHOLD = 1.8
const SHAKE_COOLDOWN_MS = 4000
const FALL_IMPACT_THRESHOLD = 2.5
const FALL_FREEFALL_THRESHOLD = 0.4
const DEFAULT_COUNTDOWN_SEC = 5
 
interface ShakeContextType {
  countdown: number | null;
  cancelSOS: () => void;
  fallDetected: boolean;
  loadValidCircles: () => Promise<void>;
}

const ShakeContext = createContext<ShakeContextType | null>(null)

 

export const ShakeProvider = ({ children }: { children: ReactNode }) => {
 
  const location = useLocation()
  const locationRef = useRef(location)
  useEffect(() => { locationRef.current = location }, [location])
 
  const [validCircleIds, setValidCircleIds] = useState<string[]>([])

  const loadValidCircles = async () => {
    try {
      const saved = await AsyncStorage.getItem("alertCircles")
      const storedCircles: string[] = saved ? JSON.parse(saved) : []
      if (storedCircles.length === 0) {
        setValidCircleIds([])
        return
      }
      const myCircles = await getMyCircles()
      const validIds = storedCircles.filter(id => myCircles.some((c: any) => c._id === id))
      setValidCircleIds(validIds)
      console.log("✅ Cached emergency circles for fast SOS access:", validIds)
    } catch (err) {
      console.log("❌ Error caching valid circles:", err)
    }
  }

useEffect(() => {
  loadValidCircles()

  const interval = setInterval(loadValidCircles, 30000)

  return () => clearInterval(interval)

}, [])
 
  const lastShakeRef = useRef(0)
  const isFallingRef = useRef(false)
 
  const [countdown, setCountdown] = useState<number | null>(null)
 
  const [fallDetected, setFallDetected] = useState(false)
 
const sendAlert = async () => {

  try {

    const currentLoc = locationRef.current
    if (!currentLoc) {
      console.log("❌ Cannot send alert: Location missing")
      return
    }

    console.log("🚨 Sending shake alert")

    let circles = validCircleIds
 
    if (circles.length === 0) {

      console.log("⚠️ No cached circles — fetching from API")

      const myCircles = await getMyCircles()

      circles = myCircles.map((c:any) => c._id)

      if (circles.length === 0) {
        console.log("❌ No circles exist for user")
        return
      }

      setValidCircleIds(circles)
    }

    console.log("✅ Sending alert to circles:", circles)
 
    await Promise.all(
      circles.map(circleId =>
        createAlert({
          latitude: currentLoc.latitude,
          longitude: currentLoc.longitude,
          alertType: "shake",
          circleId
        })
      )
    )

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    console.log("🚨 ALERT SENT SUCCESSFULLY")

  } catch (err) {

    console.log("❌ Alert error:", err)

  }

}
 
  useEffect(() => {

    if (countdown === null) return

    if (countdown === 0) {

      sendAlert()

      setCountdown(null)

      return
    }

    const timer = setTimeout(() => {

      setCountdown(prev => prev! - 1)

    }, 1000)

    return () => clearTimeout(timer)

  }, [countdown])
 
  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x * x + y * y + z * z)
      const now = Date.now()
      
      // Consolidated SHAKE DETECTION
      if (force > SHAKE_FORCE_THRESHOLD && now - lastShakeRef.current > SHAKE_COOLDOWN_MS) {
        console.log("🚨 SHAKE DETECTED", { force })
        lastShakeRef.current = now
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        setCountdown(DEFAULT_COUNTDOWN_SEC)
      }

      // Consolidated FALL DETECTION
      const freeFall = force < FALL_FREEFALL_THRESHOLD
      const impact = force > FALL_IMPACT_THRESHOLD

      if (freeFall) {
        setFallDetected(true) // For UI feedback if needed
        isFallingRef.current = true
      }

      if (isFallingRef.current && impact && now - lastShakeRef.current > SHAKE_COOLDOWN_MS) {
        console.log("🚨 FALL DETECTED")
        isFallingRef.current = false
        setFallDetected(false)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        setCountdown(DEFAULT_COUNTDOWN_SEC)
      }
    })

    Accelerometer.setUpdateInterval(200)
    return () => subscription.remove()
  }, [])

  return (

    <ShakeContext.Provider
      value={{
        countdown,
        fallDetected,
        loadValidCircles,
        cancelSOS: () => {
          setCountdown(null);
          setFallDetected(false);
          isFallingRef.current = false;
        }
      }}
    >
      {children}
    </ShakeContext.Provider>

  )

}
 
export const useShake = () => useContext(ShakeContext)