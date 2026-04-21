import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView
} from "react-native";
import { Audio } from "expo-av";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

type Props = NativeStackScreenProps<any>;

export default function FakeCallScreen({ navigation, route }: Props) {

  const soundRef = useRef<Audio.Sound | null>(null);

  const callerName = route?.params?.name || "Dad";

  useEffect(() => {

    // const playRingtone = async () => {

    // //   const { sound } = await Audio.Sound.createAsync(
    // //     require("../../assets/ringtone.mp3"),
    // //     { shouldPlay: true, isLooping: true }
    // //   );

    //   soundRef.current = sound;

    // };

    // playRingtone();

    return () => {
      stopSound();
    };

  }, []);

  const stopSound = async () => {

    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

  };

  const endCall = async () => {
    await stopSound();
    navigation.goBack();
  };

  return (
 <LinearGradient
      // Colors sampled from your image
      start={{ x: 0, y: 0}} 
    end={{ x: 1, y: 1}}
      colors={['#1a1d24', '#47A9A1', '#927DB1']}
      locations={[0.45, 0.6, 0.9]} // Adjusts where each color starts
      style={styles.container}
    >

      {/* CALL INFO */}

      <View style={styles.topSection}>

        <Text style={styles.callingText}>Incoming call</Text>

        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/147/147144.png"
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{callerName}</Text>

        <Text style={styles.mobile}>Mobile</Text>

      </View>

      {/* CALL ACTIONS */}

      <View style={styles.bottomSection}>

        <TouchableOpacity
          style={styles.declineBtn}
          onPress={endCall}
        >
          <Text style={styles.btnText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={endCall}
        >
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>

      </View>

    </LinearGradient>

  );

}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#000",
justifyContent:"space-between",
paddingVertical:60
},

topSection:{
alignItems:"center"
},

callingText:{
color:"#bbb",
fontSize:18,
marginBottom:20
},

avatar:{
width:130,
height:130,
borderRadius:65,
marginBottom:20
},

name:{
color:"#fff",
fontSize:36,
fontWeight:"600"
},

mobile:{
color:"#aaa",
fontSize:16,
marginTop:4
},

bottomSection:{
flexDirection:"row",
justifyContent:"space-evenly",
alignItems:"center",
marginBottom:40
},

declineBtn:{
backgroundColor:"#e53935",
width:90,
height:90,
borderRadius:45,
justifyContent:"center",
alignItems:"center"
},

acceptBtn:{
backgroundColor:"#4CAF50",
width:90,
height:90,
borderRadius:45,
justifyContent:"center",
alignItems:"center"
},

btnText:{
color:"#fff",
fontWeight:"bold",
fontSize:16
}

});