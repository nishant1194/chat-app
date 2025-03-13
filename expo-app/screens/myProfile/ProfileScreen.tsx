import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // ✅ Import useNavigation
import Linkk from "assets/Linkk";


const ProfileScreen = () => {
  const navigation = useNavigation(); // ✅ Get navigation object


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isEditing , setIsEditing] = useState(false);
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload";
  const CLOUDINARY_PRESET = "YOUR_UPLOAD_PRESET"; // Replace with your preset

  useEffect(()=>{
    const fetchUser = async()=>{
      setName(await AsyncStorage.getItem("chatAppName"));
      setEmail(await AsyncStorage.getItem("chatAppEmail"));
     }
     fetchUser()
  })
const handleSave = async()=>{
  try {
    const storedToken = await AsyncStorage.getItem("chatAppToken") || "something";

    const response = await axios.get(
      Linkk+"/api/auth/update-profile",
      {
       headers: {
         Authorization: `Bearer ${storedToken}`,   
         "Content-Type": "application/json",
       },
     }
     );
  } catch (error) {
    console.log(error)
  }

}
  const pickImage = async () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.didCancel) return;
      if (response.error) {
        Alert.alert("Error", "Could not select image");
        return;
      }
      
      const imageUri = response.assets[0].uri;
      setProfilePic(imageUri);

      // Upload to Cloudinary
      const data = new FormData();
      data.append("file", { uri: imageUri, type: "image/jpeg", name: "profile.jpg" });
      data.append("upload_preset", CLOUDINARY_PRESET);

      try {
        const uploadRes = await axios.post(CLOUDINARY_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProfilePic(uploadRes.data.secure_url);
      } catch (error) {
        Alert.alert("Upload Failed", "Could not upload image");
      }
    });
  };

  const showToast = (text1:string ,type:string) => {
    Toast.show({
      type: type,
      text1: text1,
     });
  };

  const handleLogout = async()=>{
    try {
      
      await AsyncStorage.removeItem("chatAppId");
      await AsyncStorage.removeItem("chatAppToken");
      showToast("Logout Successfully!" , "success");
        navigation.navigate("login"); 
    } catch (error) {
      showToast("Logout Error!" , "info");
      console.error("Error removing token:", error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#ECE5DD] px-6 items-center">
      {/* Header */}
      <View className="flex flex-row justify-between items-center py-4 border-b border-gray-300 w-full">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#128C7E" className="hidden" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Profile</Text>
        <TouchableOpacity>
          <Ionicons name="checkmark" size={24} color="#128C7E" className="hidden"/>
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <View className="items-center mt-6">
        <TouchableOpacity onPress={pickImage} className="relative">
          <Image
            source={{
              uri: profilePic || "https://res.cloudinary.com/drzxyuyql/image/upload/v1735851581/wz017mi9kp2shfc9iczg.png",
            }}
            className="w-32 h-32 rounded-full border-4 border-gray-300"
          />
          <View className="absolute bottom-1 right-1 bg-[#128C7E] p-2 rounded-full border border-gray-100">
            <Ionicons name="camera" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Editable Fields */}
      <View className="mt-6 space-y-4 w-full">
        <View className="bg-gray-100 p-4 mb-2 rounded-xl shadow-sm">
          <Text className="text-gray-500">Name</Text>
         {isEditing && <TextInput
            className="text-lg font-semibold text-black mt-1 bg-gray-200 rounded-2xl"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#666"
          />}
          {!isEditing && <Text className="text-lg font-semibold text-black mt-1" >{name}</Text>}

        </View>

        <View className="bg-gray-100 p-4 mb-2 rounded-xl shadow-sm">
          <Text className="text-gray-500">Email</Text>
          {isEditing&&<TextInput
            className="text-lg font-semibold text-black mt-1 bg-gray-200 rounded-2xl"
            value={email}
            onChangeText={setEmail}
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
            placeholderTextColor="#666"
          />}
          {!isEditing&&<Text className="text-lg font-semibold text-black mt-1">{email}</Text>}
        </View>


      </View>
       {/* {!isEditing && <TouchableOpacity className="bg-green-600 px-14 py-2 mt-6 rounded-2xl">
          <Text className="text-white text-xl font-bold" onPress={()=>{setIsEditing(true)}}>Edit</Text>
        </TouchableOpacity>} */}

        {isEditing && <TouchableOpacity className="bg-green-600 px-14 py-2 mt-6 rounded-2xl" onPress={handleSave}>
          <Text className="text-white text-xl font-bold" onPress={()=>{
              setIsEditing(false)
              showToast("Saved Successfully!" , "success");
            
          }}>Save</Text>
        </TouchableOpacity>}

        <TouchableOpacity className="bg-green-600 px-14 py-2 mt-3 rounded-2xl">
          <Text className="text-white text-xl font-bold" onPress={handleLogout}>LogOut</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;
