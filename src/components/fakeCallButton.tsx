import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity } from "react-native"

export default function FakeCallButton() {

  const navigation = useNavigation()

  const triggerFakeCall = () => {

    // simulate delay before ringing
    setTimeout(() => {
      navigation.navigate("FakeCall")
    })

  }

  return (

    <TouchableOpacity
      style={styles.button}
      onPress={triggerFakeCall}
    >
      <Text style={styles.text}>📞 Fake Call</Text>
    </TouchableOpacity>

  )

}

const styles = StyleSheet.create({

  button:{
    backgroundColor:"#222",
    paddingVertical:14,
    paddingHorizontal:25,
    borderRadius:30,
    marginTop:10
  },

  text:{
    color:"white",
    fontWeight:"bold",
    fontSize:16
  }

})