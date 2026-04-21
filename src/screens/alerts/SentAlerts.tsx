import React, { useCallback, useEffect, useState } from "react"
import {
  Alert,
  FlatList,
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from "react-native"

import { useFocusEffect } from "@react-navigation/native"
import { deleteAlert, getMyAlerts, resolveAlert } from "../../api/alertApi"
import { useSocket } from "../../context/SocketContext"

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
HELPERS
------------------------------------------------
*/
const formatDate = (date: string) => new Date(date).toLocaleString()

/*
------------------------------------------------
SENT ALERT SCREEN (REAL-TIME VERSION)
------------------------------------------------
*/

export default function SentAlertsScreen(){

  const [alerts, setAlerts] = useState<any[]>([])
  const socket = useSocket()

  /*
  ------------------------------------------------
  INITIAL LOAD
  ------------------------------------------------
  */
  useFocusEffect(
    useCallback(()=>{

      const loadAlerts = async ()=>{

        try{

          const data = await getMyAlerts()

          setAlerts(data)

        }catch(err){

          console.log("Failed to load alerts:",err)

        }

      }

      loadAlerts()

    },[])
  )

  /*
  ------------------------------------------------
  SOCKET LISTENERS
  ------------------------------------------------
  */
  useEffect(()=>{

    if(!socket) return

    /*
    ----------------------------------------
    NEW ALERT (YOU CREATED)
    ----------------------------------------
    */
    const handleNewAlert = (data:any)=>{

      LayoutAnimation.configureNext(
        LayoutAnimation.Presets.easeInEaseOut
      )

      setAlerts(prev=>{

        if(prev.some(a=>a._id===data._id))
          return prev

        return [data,...prev]

      })

    }

    /*
    ----------------------------------------
    ALERT RESOLVED
    ----------------------------------------
    */
    const handleResolved = (data:any)=>{

      LayoutAnimation.configureNext(
        LayoutAnimation.Presets.easeInEaseOut
      )

      setAlerts(prev=>
        prev.map(alert=>
          alert._id===data.alertId
            ? {...alert,status:"resolved"}
            : alert
        )
      )

    }

    /*
    ----------------------------------------
    ALERT DELETED
    ----------------------------------------
    */
    const handleDeleted = (data:any)=>{

      LayoutAnimation.configureNext(
        LayoutAnimation.Presets.easeInEaseOut
      )

      setAlerts(prev=>
        prev.filter(alert=>alert._id!==data.alertId)
      )

    }

    socket.on("sos-alert",handleNewAlert)
    socket.on("alert-resolved",handleResolved)
    socket.on("alert-deleted",handleDeleted)

    return ()=>{

      socket.off("sos-alert",handleNewAlert)
      socket.off("alert-resolved",handleResolved)
      socket.off("alert-deleted",handleDeleted)

    }

  },[socket])

  /*
  ------------------------------------------------
  RESOLVE ALERT
  ------------------------------------------------
  */
  const handleResolve = async (alertId)=>{

    try{

      await resolveAlert(alertId)

      LayoutAnimation.configureNext(
        LayoutAnimation.Presets.easeInEaseOut
      )

      setAlerts(prev=>
        prev.map(alert=>
          alert._id===alertId
            ? {...alert,status:"resolved"}
            : alert
        )
      )

    }catch(error){

      console.log(error)

    }

  }

  /*
  ------------------------------------------------
  DELETE ALERT
  ------------------------------------------------
  */
  const handleDelete = async (alertId)=>{

    Alert.alert(
      "Delete Alert",
      "Are you sure you want to delete this alert?",
      [
        {text:"Cancel",style:"cancel"},
        {
          text:"Delete",
          onPress:async()=>{

            try{

              await deleteAlert(alertId)

              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              )

              setAlerts(prev=>
                prev.filter(alert=>alert._id!==alertId)
              )

            }catch(err){

              console.log(err)

            }

          }
        }
      ]
    )

  }

  /*
  ------------------------------------------------
  UI
  ------------------------------------------------
  */

  return(
    <FlatList
      data={alerts}
      keyExtractor={(item:any)=>item._id.toString()}
      ListEmptyComponent={
        <View style={{padding: 50, alignItems: 'center'}}>
          <Text style={{color: 'gray'}}>No alerts sent yet.</Text>
        </View>
      }
      renderItem={({item}:any)=>(
        <View style={{
          padding:15, 
          borderBottomWidth: 1, 
          borderColor: '#eee',
          backgroundColor: item.status === 'resolved' ? '#f9f9f9' : '#fff'
        }}>

          <Text>Type: {item.alertType}</Text>
          <Text style={{ 
            fontWeight: 'bold', 
            color: item.status === 'resolved' ? 'green' : 'red' 
          }}>
            Status: {item.status.toUpperCase()}
          </Text>

          <Text>
            To: {item.circleId?.name || item.circleName || "Unknown"}
          </Text>

          <Text>
            Created: {formatDate(item.createdAt)}
          </Text>

          {/* RESOLVE BUTTON */}
          {item.status!=="resolved" &&(

            <TouchableOpacity
              onPress={()=>handleResolve(item._id)}
              style={{
                marginTop:10,
                backgroundColor:"green",
                padding:8,
                borderRadius:6
              }}
            >

              <Text style={{color:"white"}}>
                Mark as Resolved
              </Text>

            </TouchableOpacity>

          )}

          {/* DELETE BUTTON */}
          <TouchableOpacity
            onPress={()=>handleDelete(item._id)}
            style={{
              marginTop:10,
              backgroundColor:"red",
              padding:8,
              borderRadius:6
            }}
          >

            <Text style={{color:"white"}}>
              Delete Alert
            </Text>

          </TouchableOpacity>

        </View>

      )}
    />

  )

}