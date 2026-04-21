import { useState } from "react"
import { View, TextInput, Button } from "react-native"
import { registerUser } from "../../api/authApi"

export default function RegisterScreen({ navigation }:any) {

  const [name,setName] = useState("")
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [phone,setPhone] = useState("")
  const [password,setPassword] = useState("")

  const handleRegister = async () => {

    try{

      const data = await registerUser({
        name,
        username,
        email,
        phone,
        password
      })

      console.log("REGISTER SUCCESS:",data)

      navigation.navigate("Main")

    }catch(err:any){

      console.log("REGISTER ERROR:",err.response?.data || err.message)

    }

  }

  return(

    <View style={{flex:1,justifyContent:"center",padding:20}}>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{borderWidth:1,marginBottom:10,padding:10}}
      />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{borderWidth:1,marginBottom:10,padding:10}}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{borderWidth:1,marginBottom:10,padding:10}}
      />

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={{borderWidth:1,marginBottom:10,padding:10}}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{borderWidth:1,marginBottom:20,padding:10}}
      />

      <Button title="Register" onPress={handleRegister} />
      <Button 
        title= "Existing user?"
        onPress={()=>navigation.navigate("Login")}
        />

    </View>

  )

}