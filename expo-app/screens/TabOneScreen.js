import { SafeAreaView, StyleSheet} from "react-native";

import Home from "./home/Home";
import Chat from "./chat/Chat";
import LoginScreen from "./login/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect,useState } from "react";

export default function TabOneScreen() {
  const [loggedin , setLoggedin] = useState();

 useEffect(()=>{
  const getLoging= async()=>{
    setLoggedin(await AsyncStorage.getItem("tokenChatapp"))
  };
  getLoging();
 })
     return (
 
     <Home />
     // <Chat />
     // <LoginScreen />
      
   );

 }

const styles = StyleSheet.create({
  container: {
    marginTop:30
 },
});
