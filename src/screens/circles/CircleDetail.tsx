import { useFocusEffect } from "@react-navigation/native"
import * as Clipboard from "expo-clipboard"
import { useCallback, useState } from "react"
import { ActivityIndicator, Alert, Button, FlatList, Image, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  deleteCircle,
  getCircleById,
  leaveCircle,
  promoteMember,
  removeMember,
} from "../../api/circleApi"

export default function CircleDetail({route,navigation}:any){

  const circleId = route?.params?.circleId

  const [circle,setCircle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchCircle = async ()=>{
    if (!circleId) return

  try {
    setLoading(true)
    const data = await getCircleById(circleId)
    setCircle(data)
  } catch (err) {
    console.log("Circle fetch error:", err)
  } finally {
    setLoading(false)
  }

}

 useFocusEffect(
  useCallback(() => {
    fetchCircle()
    return () => {
      setCircle(null)
    }
  }, [circleId])
)

  const confirmAction = (title: string, message: string, onConfirm: () => Promise<void>) => {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", style: "destructive", onPress: onConfirm }
    ])
  }

 if(!circle){
  return (
    <SafeAreaView style={styles.center}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  )
}

 
  return(

    <SafeAreaView style={{flex:1 ,padding:20}}>

      <Text style={{fontSize:22}}>
        {circle.name}
      </Text>

      {/* Invite Code */}

      <Text style={{marginTop:20,fontWeight:"bold"}}>
        Invite Code
      </Text>

      <Text style={{fontSize:20}}>
        {circle.inviteCode}
      </Text>

      <Button
        title="Copy Code"
        onPress={async () => {
          await Clipboard.setStringAsync(circle.inviteCode);
          Alert.alert("Success", "Invite code copied to clipboard!");
        }}
      />

      {/* Members */}

      <Text style={{marginTop:20,fontWeight:"bold"}}>
        Members
      </Text>

      <FlatList
        data={circle.members}
        keyExtractor={(item)=>item.user._id}
        contentContainerStyle={{ gap: 15, marginTop: 10 }}
       renderItem={({item}) => (

  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 10, borderRadius: 8 }}>

    {/* User Avatar */}
    <Image
      source={{
        uri:
          item.user.profilePicture ||
          "https://cdn-icons-png.flaticon.com/512/3247/3247933.png"
      }}
      style={styles.avatar}
    />

    {/* User Info */}
    <View style={{flex:1, marginLeft: 10}}>

      <Text>
        {item.user.username}
      </Text>

      <Text>
        Role: {item.role}
      </Text>

    </View>

    {/* Actions */}
    <View>
      <Button
        title="Promote"
        disabled={loading || item.role === 'admin'}
        onPress={async () => {
          try {
            setLoading(true)
            await promoteMember(circle._id, item.user._id)
            await fetchCircle()
          } catch (err) {
            Alert.alert("Error", "Failed to promote member")
          } finally {
            setLoading(false)
          }
        }}
      />
      <Button
        title="Remove"
        disabled={loading || item.role === 'admin'}
        onPress={() => confirmAction(
          "Remove Member",
          `Are you sure you want to remove ${item.user.username}?`,
          async () => {
            try {
              setLoading(true)
              await removeMember(circle._id, item.user._id)
              await fetchCircle()
            } catch (err) {
              Alert.alert("Error", "Failed to remove member")
            } finally {
              setLoading(false)
            }
          }
        )}
      />
    </View>
  </View>

)}
      
      />

      <Button
  title="Delete"
  disabled={loading}
  onPress={() => confirmAction(
    "Delete Circle",
    "This action is permanent. All members will be removed.",
    async () => {
      try {
        await deleteCircle(circle._id)
        setCircle(null)
        navigation.goBack()
      } catch (err) {
        Alert.alert("Error", "Could not delete circle")
      }
    }
  )}
    />
      <Button
  title="Leave Circle"
  disabled={loading}
  onPress={() => confirmAction(
    "Leave Circle",
    "You will no longer receive alerts from this circle.",
    async () => {
      try {
        await leaveCircle(circle._id)
        setCircle(null)
        navigation.goBack()
      } catch (err) {
        Alert.alert("Error", "Could not leave circle")
      }
    }
  )}
    />

    </SafeAreaView>

  )

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    padding:20
  },

  center:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  avatarContainer:{
    alignItems:"center",
    marginBottom:20
  },

  avatar:{
    width:120,
    height:120,
    borderRadius:60
  },
})