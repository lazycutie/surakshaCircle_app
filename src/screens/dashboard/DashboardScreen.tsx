import { useEffect, useRef, useState } from "react"
import { View, StyleSheet, Image } from "react-native"
import MapView, { Marker } from "react-native-maps"

import useVoiceDistress from "../../hooks/useVoiceDistress"
import useLocation from "../../hooks/useLocation"

import { triggerSOSAlert } from "../../components/sos/SosButton"
import SosButton from "../../components/sos/SosButton"
import FakeCallButton from "../../components/fakeCallButton"

import { useSocket } from "../../context/SocketContext"

import { getMyCircles } from "../../api/circleApi"
import { getCircleMembersLocation } from "../../api/locationApi"

export default function DashboardScreen() {

  const socket = useSocket()
  const location = useLocation()

  const mapRef = useRef<MapView>(null)

  const [circleIds, setCircleIds] = useState<string[]>([])
  const [members, setMembers] = useState<any[]>([])

  /*
  -------------------------
  VOICE SOS
  -------------------------
  */

  const triggerVoiceSOS = () => {

    if (!location) return

    triggerSOSAlert(location.latitude, location.longitude)

  }

  useVoiceDistress(triggerVoiceSOS)

  /*
  -------------------------
  LOAD USER CIRCLES
  -------------------------
  */

  useEffect(() => {

    const loadCircles = async () => {

      try {

        const circles = await getMyCircles()

        setCircleIds(circles.map(c => c._id))

      } catch (err) {

        console.log("Circle load error:", err)

      }

    }

    loadCircles()

  }, [])

  /*
  -------------------------
  JOIN SOCKET ROOMS
  -------------------------
  */

  useEffect(() => {

    if (!socket || circleIds.length === 0) return

    circleIds.forEach(id => socket.emit("join-circle", id))

  }, [socket, circleIds])

  /*
  -------------------------
  LOAD MEMBERS LOCATION
  -------------------------
  */

  useEffect(() => {

    const loadMembers = async () => {

      try {

        let allMembers: any[] = []

        for (const id of circleIds) {

          const data = await getCircleMembersLocation(id)

          allMembers = [...allMembers, ...data]

        }

        const unique = Array.from(
          new Map(allMembers.map(m => [m.userId, m])).values()
        )

        setMembers(unique)

      } catch (err) {

        console.log("Load members error:", err)

      }

    }

    if (circleIds.length) loadMembers()

  }, [circleIds])

  /*
  -------------------------
  SOCKET LIVE LOCATION
  -------------------------
  */

  useEffect(() => {

    if (!socket) return

    const handleLiveLocation = (data: any) => {

      setMembers(prev => {

        const index = prev.findIndex(
          m => String(m.userId) === String(data.userId)
        )

        if (index !== -1) {

          const updated = [...prev]

          updated[index] = {
            ...updated[index],
            latitude: data.latitude,
            longitude: data.longitude
          }

          return updated
        }

        return [
          ...prev,
          {
            userId: data.userId,
            latitude: data.latitude,
            longitude: data.longitude,
            profilePicture: null
          }
        ]

      })

    }

    socket.on("live-location", handleLiveLocation)

    return () => socket.off("live-location", handleLiveLocation)

  }, [socket])

  /*
  -------------------------
  SEND MY LOCATION
  -------------------------
  */

  useEffect(() => {

    if (!location || !socket) return

    circleIds.forEach(id => {

      socket.emit("update-location", {
        circleId: id,
        latitude: location.latitude,
        longitude: location.longitude
      })

    })

  }, [location])

  /*
  -------------------------
  LOADING
  -------------------------
  */

  if (!location) {
    return <View style={styles.loading}/>
  }

  /*
  -------------------------
  MAP
  -------------------------
  */

  return (

    <View style={styles.container}>

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }}
      >

        {/* SELF MARKER */}

        <Marker coordinate={location}>
          <View style={styles.selfMarker}/>
        </Marker>

        {/* MEMBER MARKERS */}

        {members.map(member => {

          if (!member.latitude || !member.longitude) return null

          return (

            <Marker
              key={member.userId}
              coordinate={{
                latitude: member.latitude,
                longitude: member.longitude
              }}
            >

              <View style={styles.memberMarker}>

                <Image
  source={{
    uri: member.profilePicture
      ? member.profilePicture.replace("http://10.91.183.58:5000", "")
      : "https://i.pravatar.cc/150"
  }}
  style={styles.memberImage}
/>

              </View>

            </Marker>

          )

        })}

      </MapView>

      <View style={styles.actions}>

        <SosButton
          latitude={location.latitude}
          longitude={location.longitude}
        />

        <FakeCallButton/>

      </View>

    </View>

  )

}

const styles = StyleSheet.create({

  container:{
    flex:1
  },

  loading:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  memberMarker:{
    width:38,
    height:38,
    borderRadius:19,
    overflow:"hidden",
    borderWidth:2,
    borderColor:"#fff"
  },

  memberImage:{
    width:"100%",
    height:"100%"
  },

  selfMarker:{
    width:18,
    height:18,
    borderRadius:9,
    backgroundColor:"#007AFF",
    borderWidth:3,
    borderColor:"#fff"
  },

  actions:{
    position:"absolute",
    bottom:40,
    alignSelf:"center",
    alignItems:"center"
  }

})