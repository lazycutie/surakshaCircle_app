/*
=====================================================
EditProfileScreen
Allows user to:
1. Update profile fields
2. Change profile picture
=====================================================
*/

import { useEffect, useState } from "react"
import {
  Alert,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Image
} from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"

/* Image picker for selecting profile pictures */
import * as ImagePicker from "expo-image-picker"

/* API functions */
import {
  getProfile,
  updateProfile,
  uploadProfilePicture
} from "../../api/userApi"


export default function EditProfileScreen({ navigation }: any) {

  /*
  =====================================================
  STATE VARIABLES
  =====================================================
  */

  /* Loading state while fetching profile */
  const [loading, setLoading] = useState(true)

  /* Profile image URL */
  const [profilePicture, setProfilePicture] = useState("")

  /* Image uploading state */
  const [isUpdating, setIsUpdating] = useState(false)

  /* Profile fields */
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [age, setAge] = useState("")


  /*
  =====================================================
  FUNCTION: FETCH USER PROFILE
  Called when screen loads
  =====================================================
  */

  const fetchProfile = async () => {

    try {

      /* Call backend API */
      const user = await getProfile()

      /* Populate form fields */
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setUsername(user.username || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
      setAge(user.age?.toString() || "")

      /* Load existing profile picture */
      setProfilePicture(user.profilePicture || "")

    } catch (err) {

      console.log("Profile fetch error:", err)

    } finally {

      /* Stop loading spinner */
      setLoading(false)

    }

  }


  /*
  =====================================================
  FUNCTION: CHANGE PROFILE PICTURE
  =====================================================
  */

  const handleUpdateProfileImage = async () => {

    /*
    Ask permission to access gallery
    */
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {

      Alert.alert(
        "Permission needed",
        "Allow gallery access to update your profile picture."
      )

      return
    }


    /*
    Open gallery for selecting image
    */
    const result = await ImagePicker.launchImageLibraryAsync({

      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsEditing: true,

      aspect: [1, 1], // square crop

      quality: 0.8

    })


    /*
    If user selected an image
    */
    if (!result.canceled && result.assets[0]) {

      try {

        setIsUpdating(true)

        /*
        Upload image to backend
        */
        const updatedUser =
          await uploadProfilePicture(result.assets[0])

        /*
        Update UI with new profile picture
        */
        setProfilePicture(updatedUser.profilePicture)

        Alert.alert(
          "Success",
          "Profile picture updated successfully"
        )

      } catch (error) {

        console.error("Image upload error:", error)

        Alert.alert(
          "Error",
          "Failed to update profile picture"
        )

      } finally {

        setIsUpdating(false)

      }

    }

  }


  /*
  =====================================================
  FUNCTION: UPDATE PROFILE DATA
  =====================================================
  */

  const handleUpdateProfile = async () => {

    try {

      /*
      Send updated data to backend
      */
      await updateProfile({

        firstName,
        lastName,
        username,
        email,
        phone,

        /* Convert age string to number */
        age: Number(age)

      })

      Alert.alert("Success", "Profile updated")

      /*
      Return to Profile screen
      */
      navigation.goBack()

    } catch (err) {

      console.log(err)

      Alert.alert("Error", "Failed to update profile")

    }

  }


  /*
  =====================================================
  RUN FETCH PROFILE ON SCREEN LOAD
  =====================================================
  */

  useEffect(() => {

    fetchProfile()

  }, [])


  /*
  =====================================================
  LOADING SCREEN
  =====================================================
  */

  if (loading) {

    return (

      <View style={styles.center}>

        <Text>Loading profile...</Text>

      </View>

    )

  }


  /*
  =====================================================
  MAIN UI
  =====================================================
  */

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView>

        <Text style={styles.title}>
          Edit Profile
        </Text>


        <View style={styles.card}>


          {/* PROFILE PICTURE SECTION */}

          <View style={styles.avatarContainer}>

            <TouchableOpacity
              onPress={handleUpdateProfileImage}
            >

              <Image
                source={{
                  uri:
                    profilePicture ||
                    "https://i.pravatar.cc/200"
                }}

                style={styles.avatar}
              />

            </TouchableOpacity>

            <Text style={styles.changePhoto}>
              Tap to change profile photo
            </Text>

          </View>


          {/* PROFILE INPUT FIELDS */}

          <Input
            label="First Name"
            value={firstName}
            setValue={setFirstName}
          />

          <Input
            label="Last Name"
            value={lastName}
            setValue={setLastName}
          />

          <Input
            label="Username"
            value={username}
            setValue={setUsername}
          />

          <Input
            label="Email"
            value={email}
            setValue={setEmail}
          />

          <Input
            label="Phone"
            value={phone}
            setValue={setPhone}
          />

          <Input
            label="Age"
            value={age}
            setValue={setAge}
            keyboard="numeric"
          />

        </View>


        {/* SAVE BUTTON */}

        <Button
          title="Save Changes"
          onPress={handleUpdateProfile}
        />

      </ScrollView>

    </SafeAreaView>

  )

}


/*
=====================================================
Reusable Input Component
=====================================================
*/

function Input({ label, value, setValue, keyboard = "default" }: any) {

  return (

    <View style={{ marginBottom: 15 }}>

      <Text style={{ marginBottom: 5, fontWeight: "600" }}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={setValue}
        keyboardType={keyboard}
        style={styles.input}
      />

    </View>

  )

}


/*
=====================================================
STYLES
=====================================================
*/

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },

  card: {
    backgroundColor: "#f4f4f4",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff"
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 25
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60
  },

  changePhoto: {
    marginTop: 10,
    color: "#007AFF"
  }

})