import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNav";
import ChatScreen from "screens/chat/Chat";
import LoginScreen from "screens/login/Login";
import SignupScreen from "screens/signup/SignUp";
import { View, ActivityIndicator } from "react-native"; // For loading indicator

const Stack = createStackNavigator();

const StackNavigator = () => {
  const [loggedIn, setLoggedIn] = useState(false); // Default: Not logged in
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const userId = await AsyncStorage.getItem("chatAppId");
        if (userId) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);  
      }
    };
    checkAuthentication();
  }, [loggedIn]);  

   if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#075E54" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {loggedIn ? (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="detailedChat" component={ChatScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
