
import './global.css';
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from 'navigations/StackNav';


export default function App() {
  return (
       <NavigationContainer>
  
      <StackNavigator />
    
    </NavigationContainer>
    
  );
}
