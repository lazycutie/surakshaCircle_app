import { useState } from "react"
import { View, Text, TextInput, StyleSheet, Button, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { changePassword } from "../../api/userApi"

export default function ChangePasswordScreen({navigation}:any){

  const [currentPassword,setCurrentPassword] = useState("")
  const [newPassword,setNewPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")


  const handleChangePassword = async ()=>{

    if(newPassword !== confirmPassword){

      alert("Passwords do not match")

      return

    }

    try{

      await changePassword({

        currentPassword,
        newPassword

      })

      alert("Password changed successfully")

      navigation.goBack()

    }catch(err){

       console.log(err.response.data)

      alert("Failed to change password")

    }

  }


  return(

    <SafeAreaView style={styles.container}>

      <ScrollView>

        <Text style={styles.title}>Change Password</Text>

        <View style={styles.card}>

          <Input
            label="Current Password"
            value={currentPassword}
            setValue={setCurrentPassword}
            secure
          />

          <Input
            label="New Password"
            value={newPassword}
            setValue={setNewPassword}
            secure
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            secure
          />

        </View>

        <Button title="Update Password" onPress={handleChangePassword} />

      </ScrollView>

    </SafeAreaView>

  )

}


/* reusable input */

function Input({label,value,setValue,secure=false}:any){

  return(

    <View style={{marginBottom:15}}>

      <Text style={{marginBottom:5,fontWeight:"600"}}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={setValue}
        secureTextEntry={secure}
        style={styles.input}
      />

    </View>

  )

}


const styles = StyleSheet.create({

  container:{
    flex:1,
    padding:20
  },

  title:{
    fontSize:22,
    fontWeight:"bold",
    marginBottom:20
  },

  card:{
    backgroundColor:"#f4f4f4",
    padding:20,
    borderRadius:12,
    marginBottom:20
  },

  input:{
    borderWidth:1,
    borderColor:"#ddd",
    padding:10,
    borderRadius:8,
    backgroundColor:"#fff"
  }

})