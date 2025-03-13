import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Linkk from "assets/Linkk";
// import { useNavigation } from '@react-navigation/native';

const ChatApp = (props) => { 
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [searchUser , setSearchUser] = useState("");

  const handleSearch = (e: string) => {
    setSearchUser(e); 
    const filtered = users.filter((item) =>{
      item?.fullName?.toLowerCase().includes(e?.toLowerCase()) // Use `e` instead of `searchUser`
    });
    setUsers(filtered); // Store filtered results separately
    console.log(filtered)
  };
  


  useEffect(() => {
    // Fetch the token and make API call
    const fetchTokenAndUsers = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("chatAppToken") || "something";
        console.log("token: " + storedToken);
          const response = await axios.get(
           Linkk+"/api/messages/users",
           {
            headers: {
              Authorization: `Bearer ${storedToken}`,   
              "Content-Type": "application/json",
            },
          }
          );
          setUsers(response?.data);
          console.log(response.data);
        
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTokenAndUsers();
  }, []);


  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        props?.navigation?.navigate("detailedChat", {
          id:item._id,
          user:item
        });
      }}
    >
      {item.profilePic ? (
        <Image source={{ uri: item.profilePic }} style={styles.avatar} />
      ) : (
        <View style={styles.defaultAvatar}>
          <Text style={styles.defaultAvatarText}>
            {item?.fullName?.charAt(0)}
          </Text>
        </View>
      )}
      <View style={styles.chatInfo}>
        <Text style={styles.name}>{item?.fullName}</Text>
        <Text style={styles.status}>{"online"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>WhatsApp</Text>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: "https://portfolio-sigma-one-53.vercel.app/static/media/Nishant.9dcb755d866c80b0ca86.JPG",
            }}
            style={{ width: 40, height: 40, borderRadius: 50, marginRight: 15 }}
            resizeMode="contain"
          />
          <Ionicons name="settings" size={25} color="white" />
        </View>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search or start new chat"
        placeholderTextColor="#666"
        value={searchUser}
        onChange={handleSearch}
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderChatItem}
      />

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#ECE5DD",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
    marginVertical: 10,
  },
  header: {
    backgroundColor: "#075E54",
    paddingHorizontal: 15,
    paddingVertical:10,
    marginTop:8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 15,
    height: 45,
    color: "#000",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  defaultAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    color: "#555",
    fontSize: 15,
  },
});

export default ChatApp;
