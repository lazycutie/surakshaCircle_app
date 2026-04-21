import { useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { getMyCircles } from "../../api/circleApi"
import React from "react";

export default function CirclesScreen({ navigation }: any) {

  const [circles, setCircles] = useState<any[]>([])

  const fetchCircles = async () => {

    try {

      const data = await getMyCircles()

      setCircles(data)

    } catch (error) {

      console.log("Fetch circles error:", error)

    }

  }

  useFocusEffect(
    React.useCallback(() => {
    fetchCircles()
  }, [])
)
  return (

    <SafeAreaView style={{ flex: 1, padding: 20 }}>

      <Button
        title="Create Circle"
        onPress={() => navigation.navigate("CreateCircle")}
      />

      <Button
        title="Join Circle"
        onPress={() => navigation.navigate("JoinCircle")}
      />

      <FlatList
        data={circles}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CircleDetail", {
                circleId: item._id
              })
            }
          >

            <View
              style={{
                padding: 15,
                borderBottomWidth: 1
              }}
            >

              <Text style={{ fontSize: 18 }}>
                {item.name}
              </Text>

              <Text>
                Members: {item.members.length}
              </Text>

            </View>

          </TouchableOpacity>

        )}
      />

    </SafeAreaView>

  )

}
