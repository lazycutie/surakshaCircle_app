import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"



/*
|--------------------------------------------------------------------------
| ALERTS SCREEN
|--------------------------------------------------------------------------
| This screen acts as a hub for:
| 1. Sent alerts
| 2. Received alerts
| 3. Send new alert to a circle
|--------------------------------------------------------------------------
*/

export default function AlertsScreen() {

  const navigation:any = useNavigation()

  return (

    <View style={styles.container}>

      <TouchableOpacity
        style={styles.button}
        onPress={()=>navigation.navigate("SentAlerts")}
      >
        <Text style={styles.text}>Sent Alerts</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.button}
        onPress={()=>navigation.navigate("ReceivedAlerts")}
      >
        <Text style={styles.text}>Received Alerts</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.button}
        onPress={()=>navigation.navigate("SendAlertCircle")}
      >
        <Text style={styles.text}>Send Alert To Circle</Text>
      </TouchableOpacity>

    </View>

  )

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  button:{
    backgroundColor:"#eee",
    padding:15,
    marginVertical:10,
    width:200,
    alignItems:"center",
    borderRadius:10
  },

  text:{
    fontSize:16
  }

})