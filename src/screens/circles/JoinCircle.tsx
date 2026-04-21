import { useState } from "react"
import { ActivityIndicator, Alert, Button, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { joinCircle } from "../../api/circleApi"

export default function JoinCircle({ navigation }: any) {
  const [inviteCode, setInviteCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    setLoading(true)
    try {
      await joinCircle(inviteCode)
      navigation.goBack()
    } catch (err) {
      Alert.alert("Error", "Invalid invite code or network issue.")
    } finally {
      setLoading(false)
    }
  }

  return (

    <SafeAreaView style={{ padding: 20 }}>

      <TextInput
        placeholder="Invite Code"
        value={inviteCode}
        onChangeText={setInviteCode}
        autoCapitalize="characters"
        autoCorrect={false}
        style={{ borderWidth: 1, padding: 10 }}
      />

      {loading ? <ActivityIndicator style={{marginTop: 10}} /> : 
        <Button title="Join Circle" onPress={handleJoin} />}

    </SafeAreaView>

  )
}