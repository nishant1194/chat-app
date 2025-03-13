import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";


const Group = (props) => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hey there!", sender: "user" },
    { id: "2", text: "Hello! How are you?", sender: "me" },
  ]);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // Function to send a text message
  const sendMessage = () => {
    if (input.trim().length === 0) return;
    setMessages([...messages, { id: Date.now().toString(), text: input, sender: "me" }]);
    setInput("");
  };

  // Function to upload image to Cloudinary
  const uploadImage = async (uri) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", {
      uri,
      type: "image/jpeg",
      name: "chat-image.jpg",
    });
    data.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary cloud name
        data
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Function to pick image and send to chat
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uploadedUrl = await uploadImage(result.assets[0].uri);
      if (uploadedUrl) {
        setMessages([...messages, { id: Date.now().toString(), image: uploadedUrl, sender: "me" }]);
      }
    }
  };

  // Render message bubble
  const renderMessage = ({ item }) => (
    <View
      className={`rounded-xl px-4 py-2 my-1 max-w-[80%] ${
        item.sender === "me" ? "self-end bg-[#DCF8C6]" : "self-start bg-white"
      }`}
    >
      {item.text && <Text className="text-gray-800">{item.text}</Text>}
      {item.image && <Image source={{ uri: item.image }} className="w-40 h-40 rounded-lg mt-1" />}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#ECE5DD]">
      {/* Header */}
      <View className="bg-[#075E54] px-4 py-3 flex-row items-center">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }}
          className="w-10 h-10 rounded-full ml-3"
        />
        <Text className="ml-3 text-white font-semibold text-lg">John Doe</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        className="flex-1 px-4 mt-2"
        inverted
      />

      {/* Message Input */}
      <View className="flex-row items-center bg-white px-3 py-2 border-t border-gray-300">
        <TouchableOpacity onPress={pickImage} className="p-3">
          <Ionicons name="image" size={24} color="gray" />
        </TouchableOpacity>
        <TextInput
          className="flex-1 p-2 bg-gray-100 rounded-lg text-gray-800"
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={sendMessage} className="ml-3 bg-[#075E54] p-3 rounded-full">
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
     
    </SafeAreaView>
  );
};
export default Group;
