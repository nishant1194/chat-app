import React, { useEffect, useState } from "react";
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
import Linkk from "assets/Linkk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: string;
}

const ChatScreen = (props: any) => {
  const { id,user } = props?.route?.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const roomId = "123"; // Example room ID (Replace with dynamic ID)

  const fetchMessages = async () => {
    try {
      const authUserId = await AsyncStorage.getItem("chatAppId");
      setUserId(authUserId);
      const resp = await axios.get(`${Linkk}/api/messages/${id}/${authUserId}`);
      setMessages(resp.data);
     } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

 

  const initSocket = async () => {
    const MYUserId = await AsyncStorage.getItem("chatAppId");

    const newSocket = io(Linkk, {
      query: {
        userId: MYUserId,
        userName: "Testingg",
      },
    });

    newSocket.on("connect", () => console.log("Socket connected"));
    newSocket.on("newMessage", (messageData: Message) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  };

  useEffect(() => {
    initSocket();
    fetchMessages();
  }, []);

  // const sendMessage = () => {
  //   if (socket && userId && input.trim()) {
  //     const data = { id: Date.now().toString(), text: input, sender: "me" };
  //     socket.emit("sendMessage", data);
  //     setMessages((prevMessages) => [...prevMessages, data]);
  //     setInput("");
  //   }
  // };
 const handleSendMessage = async (e) => {
  const MYUserId = await AsyncStorage.getItem("chatAppId");
     if (!input && !imagePreview) return; // Prevent sending empty messages
if(imagePreview){
  //  const toastId = toast.loading("Sending...");  // Show loading toast
 
}
    try {
      const resp = await axios.post(
        Linkk+ `/api/messages/send/${id}`,
        {
          text: input,
          image: imagePreview,
          myId: MYUserId,
        }
      );

      setMessages((prevMessages) => [...prevMessages, resp.data]);
      // Reset input fields after successful send
      setInput("");
      setImagePreview("");
      // if (fileInputRef.current) fileInputRef.current.value = "";
      //  toast.success("Message sent", { id: toastId });  // Show success toast
    } catch (error) {
      console.error("Failed to send message:", error);
     }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uploadedUrl = await uploadImage(result.assets[0].uri);
      if (uploadedUrl) {
        const data = { id: Date.now().toString(), image: uploadedUrl, sender: "me" };
        socket?.emit("sendMessage", data);
        setMessages([...messages, data]);
      }
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", {
      uri,
      type: "image/jpeg",
      name: "chat-image.jpg",
    } as any);
    data.append("upload_preset", "your_upload_preset");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
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

  const renderMessage = ({ item }) => (
    <View
    className={`rounded-xl px-4 py-2 my-1 max-w-[80%] ${
      item.senderId === userId ? "self-end bg-[#DCF8C6]" : "self-start bg-white"
    }`}
  >
    {item.text && <Text className="text-gray-800">{item.text}</Text>}
    {item.image && (
       <Image
        source={{ uri: item?.image }}
        className="w-40 h-40 rounded-lg mt-1"
        />
      // <Text>{item.image}</Text>
     )}
  </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#ECE5DD]">
      <View className="bg-[#075E54] px-4 py-3 flex-row items-center">
        <TouchableOpacity onPress={()=>{
          props?.navigation?.replace('Tabs')
        }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image
          source={{ uri: user?.profilePic }}
          className="w-10 h-10 rounded-full ml-3"
        />
        <Text className="ml-3 text-white font-semibold text-lg">{user?.fullName}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        className="flex-1 px-4 mt-2"
       />
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
        <TouchableOpacity onPress={handleSendMessage} className="ml-3 bg-[#075E54] p-3 rounded-full">
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
