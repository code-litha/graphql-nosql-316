import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import SearchUserScreen from "../screens/SearchUser";
import { Ionicons } from "@expo/vector-icons";
import AddProductsScreen from "../screens/AddProducts";

const Tab = createBottomTabNavigator();

export default function HomeTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let colorName = focused ? "red" : "gray";

          if (route.name === "Home") {
            iconName = focused ? "home-outline" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "SearchUser") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "AddProducts") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={colorName} />;
        },
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name={"Home"} component={HomeScreen} />
      <Tab.Screen name={"AddProducts"} component={AddProductsScreen} />
      <Tab.Screen name={"SearchUser"} component={SearchUserScreen} />
      <Tab.Screen name={"Profile"} component={ProfileScreen} />
    </Tab.Navigator>
  );
}
