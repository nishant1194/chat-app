import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Linkk from "assets/Linkk";
 
const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const resp = await axios.post(Linkk + "/api/auth/login", { email, password });
      if (resp.data?._id) {
        await AsyncStorage.setItem("chatAppId", resp.data._id);
        await AsyncStorage.setItem("chatAppToken", resp.data.token);
        await AsyncStorage.setItem("chatAppName", resp.data.fullName);
        await AsyncStorage.setItem("chatAppEmail", resp.data.email);
        await AsyncStorage.setItem("chatAppPP", resp.data.profilePic);
        props.navigation.replace("Tabs"); 
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <View className="flex-1 justify-center items-center bg-[#ECE5DD] px-6">
      {/* Card Container */}
      <View
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg"
        style={{
          elevation: 5, // Shadow for Android
          shadowColor: "#000", // Shadow for iOS
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      >
        <Text className="text-2xl font-bold text-center text-[#075E54] mb-4">
          WhatsApp Login
        </Text>

        {/* Email Input */}
        <View className="w-full mb-4">
          <Text className="text-gray-600 mb-1">Email</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View className="w-full mb-4">
          <Text className="text-gray-600 mb-1">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-3">
            <TextInput
              className="flex-1 p-3"
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity className="w-full bg-[#25D366] py-3 rounded-xl mt-4" onPress={handleLogin}>
          <Text className="text-center text-white font-bold text-lg">
            Login
          </Text>
        </TouchableOpacity>

        {/* Signup Redirect */}
        <View className="flex flex-row justify-center items-center mt-4">
  <Text className="text-center text-gray-600">
    Already have an account?
  </Text>
  <TouchableOpacity
    onPress={() => props?.navigation.navigate("signup")}
  >
    <Text className="font-semibold text-[#075E54] ml-1">Sign Up</Text>
  </TouchableOpacity>
</View>

      </View>
    </View>
  );
};

export default LoginScreen;
