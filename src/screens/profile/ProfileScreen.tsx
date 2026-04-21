import { useContext, useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"
import { useCallback } from "react"
import { View, Text, Image, StyleSheet, FlatList, Button } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { getProfile } from "../../api/userApi"
import { AuthContext } from "@/src/context/AuthContext"

export default function ProfileScreen({ navigation }: any) {

  const [user,setUser] = useState<any>(null)

  const fetchProfile = async ()=>{

    try{

      const data = await getProfile()

      setUser(data)

    }catch(err){

      console.log("Profile fetch error:",err)

    }

  }

 

 const { logout } = useContext(AuthContext)

 

useFocusEffect(
  useCallback(() => {

    fetchProfile()

  }, [])
)


  if(!user){
    return(
      <View style={styles.center}>
        <Text>Loading profile...</Text>
      </View>
    )
  }

  return(

    <SafeAreaView style={styles.container}>

      <FlatList

        data={[]} // no list data, only header content

        ListHeaderComponent={

          <View>

            {/* Profile Picture */}

            <View style={styles.avatarContainer}>

              <Image
                source={{
                  uri: user.profilePicture || "https://cdn-icons-png.flaticon.com/512/3247/3247933.png"
                }}
                style={styles.avatar}
              />

            </View>


            {/* Name */}

            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>


            {/* Username */}

            <Text style={styles.username}>
              @{user.username}
            </Text>


            {/* Details Card */}

            <View style={styles.card}>

              <ProfileRow label="Email" value={user.email} />

              <ProfileRow label="Phone" value={user.phone} />

              <ProfileRow label="Age" value={user.age?.toString()} />

            </View>


            {/* Actions */}

            <View style={styles.actions}>

              <Button title="Edit Profile" 
            onPress={() => navigation.navigate("EditProfile")}
              />

  <Button
    title="Change Password"
    onPress={() => navigation.navigate("ChangePassword")}
  />
          <Button title="Logout" onPress={logout} />
            </View>

          </View>

        }

      />

    </SafeAreaView>

  )

}


/* Row component for profile fields */

function ProfileRow({label,value}:{label:string,value?:string}){

  return(

    <View style={styles.row}>

      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value || "Not set"}</Text>

    </View>

  )

}


/* Styles */

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

  name:{
    fontSize:22,
    fontWeight:"bold",
    textAlign:"center"
  },

  username:{
    textAlign:"center",
    color:"gray",
    marginBottom:20
  },

  card:{
    backgroundColor:"#f5f5f5",
    borderRadius:12,
    padding:15,
    marginBottom:20
  },

  row:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:10
  },

  label:{
    fontWeight:"600"
  },

  value:{
    color:"#444"
  },

  actions:{
    gap:10
  }

})