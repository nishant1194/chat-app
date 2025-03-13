import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Group from "screens/groups/Group";
import ChatApp from "screens/home/Home";
import ProfileScreen from "screens/myProfile/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const TabNavigator = () => (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
         if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Groups") {
          iconName = focused ? "people" : "people-outline";
        } else if (route.name === "Profile") {
          iconName = focused ? "person" : "person-outline";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#007bff", // Active icon color
      tabBarInactiveTintColor: "gray",  // Inactive icon color
      tabBarStyle: { backgroundColor: "#f8f9fa", paddingBottom: 5 }, // Style the tab bar
    })}
  >
    <Tab.Screen name="Home" component={ChatApp} />
    <Tab.Screen name="Groups" component={Group} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>

);

export default TabNavigator
