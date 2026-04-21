import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getMyCircles } from "../../api/circleApi"
import { useFocusEffect } from "@react-navigation/native"
import React from "react"



/*
|--------------------------------------------------------------------------
| SELECT ALERT CIRCLES SCREEN
|--------------------------------------------------------------------------
| Allows user to enable which circles receive SOS alerts.
|--------------------------------------------------------------------------
*/

export default function SelectAlertCirclesScreen(){

  const [circles,setCircles] = useState([])
  const [selectedCircles,setSelectedCircles] = useState<string[]>([])



  /*
  ------------------------------------------------
  LOAD USER CIRCLES
  ------------------------------------------------
  */

  const loadCircles = async ()=>{

    const data = await getMyCircles()

    setCircles(data)

  }



  /*
  ------------------------------------------------
  LOAD SAVED SELECTION
  ------------------------------------------------
  */

  const loadSavedSelection = async ()=>{

    const saved = await AsyncStorage.getItem("alertCircles")

    if(saved){

      setSelectedCircles(JSON.parse(saved))

    }

  }


   useFocusEffect(
      React.useCallback(() => {
          loadCircles()
    loadSavedSelection()
    }, [])
  )



  /*
  ------------------------------------------------
  TOGGLE CIRCLE
  ------------------------------------------------
  */

  const toggleCircle = async (circleId:string)=>{

    let updated = []

    if(selectedCircles.includes(circleId)){

      /*
      REMOVE CIRCLE
      */

      updated = selectedCircles.filter(id => id !== circleId)

    }

    else{

      /*
      ADD CIRCLE
      */

      updated = [...selectedCircles,circleId]

    }



    setSelectedCircles(updated)

    await AsyncStorage.setItem("alertCircles",JSON.stringify(updated))

  }



  return(

    <View style={styles.container}>

      <Text style={styles.title}>Select Circles for SOS Alerts</Text>

      <FlatList
        data={circles}
        keyExtractor={(item:any)=>item._id}

        renderItem={({item}:any)=>{

          const checked = selectedCircles.includes(item._id)

          return(

            <TouchableOpacity
              style={styles.row}
              onPress={()=>toggleCircle(item._id)}
            >

              <Text style={styles.circleName}>
                {item.name}
              </Text>

              <Text style={styles.checkbox}>
                {checked ? "☑" : "☐"}
              </Text>

            </TouchableOpacity>

          )

        }}

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

  row:{
    flexDirection:"row",
    justifyContent:"space-between",
    padding:18,
    backgroundColor:"#f4f4f4",
    borderRadius:10,
    marginBottom:10
  },

  circleName:{
    fontSize:18
  },

  checkbox:{
    fontSize:22
  }

})