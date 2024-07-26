import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import HomeTab from "./HomeTab";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isLoggedIn } = useContext(AuthContext);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="HomeTab" component={HomeTab} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
