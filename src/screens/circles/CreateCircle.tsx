import { useState } from "react"
import { View, TextInput, Button, Text } from "react-native"
import { createCircle } from "../../api/circleApi"
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CreateCircle({ navigation }:any){

  const [name,setName] = useState("")

  const handleCreate = async ()=>{

    if(!name.trim()){
      alert("Circle name required")
      return
    }

    const circle = await createCircle(name)

    navigation.navigate("CircleDetail",{
      circleId:circle._id
    })

    console.log("circle:", circle)
  }

  return(

    <SafeAreaView style={{padding:20}}>

      <Text style={{fontSize:20}}>Create Circle</Text>

      <TextInput
        placeholder="Circle Name"
        value={name}
        onChangeText={setName}
        style={{borderWidth:1,padding:10,marginVertical:20}}
      />

      <Button
        title="Create Circle"
        onPress={handleCreate}
      />

    </SafeAreaView>

  )

}