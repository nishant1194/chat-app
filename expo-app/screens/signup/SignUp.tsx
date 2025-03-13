import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const SignupScreen = (props) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1 items-center justify-center bg-[#ECE5DD] px-6">
      {/* Card Container */}
      <View
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
        style={{
          elevation: 5, // Android Shadow
          shadowColor: '#000', // iOS Shadow
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}>
        <Text className="mb-4 text-center text-2xl font-bold text-[#075E54]">
          Create an Account
        </Text>

        {/* Name Input */}
        <View className="mb-4 w-full">
          <Text className="mb-1 text-gray-600">Name</Text>
          <TextInput
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3"
            placeholder="Enter your name"
            keyboardType="email-address"
            autoCapitalize="none"
            value={name}
            onChangeText={setName}
          />
        </View>
        {/* Email Input */}
        <View className="mb-4 w-full">
          <Text className="mb-1 text-gray-600">Email</Text>
          <TextInput
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View className="mb-4 w-full">
          <Text className="mb-1 text-gray-600">Password</Text>
          <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-3">
            <TextInput
              className="flex-1 p-3"
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Signup Button */}
        <TouchableOpacity className="mt-4 w-full rounded-xl bg-[#25D366] py-3">
          <Text className="text-center text-lg font-bold text-white">Sign Up</Text>
        </TouchableOpacity>

        {/* Login Redirect */}
        <View className="flex flex-row justify-center items-center mt-4">
  <Text className="text-center text-gray-600">
    Already have an account?
  </Text>
  <TouchableOpacity
    onPress={() => props?.navigation.navigate("login")}
  >
    <Text className="font-semibold text-[#075E54] ml-1">Login</Text>
  </TouchableOpacity>
</View>

      </View>
    </View>
  );
};

export default SignupScreen;
