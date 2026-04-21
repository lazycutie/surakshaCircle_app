import { useState } from "react"
import { View, TextInput, Button } from "react-native"
import { createZone } from "../../api/zoneApi"

export default function CreateZoneScreen({route,navigation}){

  const { latitude, longitude, circleId } = route.params

  const [name,setName] = useState("")
  const [radius,setRadius] = useState("150")

  const handleCreate = async () => {

    await createZone({

      circleId,
      name,
      latitude,
      longitude,
      radius:Number(radius)

    })

    navigation.goBack()

  }

  return(

    <View style={{padding:20}}>

      <TextInput
        placeholder="Zone name (Home, Gym)"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Radius in meters"
        value={radius}
        onChangeText={setRadius}
        keyboardType="numeric"
      />

      <Button
        title="Create Zone"
        onPress={handleCreate}
      />

    </View>

  )

}