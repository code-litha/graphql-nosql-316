import { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";

export default function ProfileScreen({ navigation }) {
  const { removeTokenLogin } = useContext(AuthContext);

  const onLogout = async () => {
    await removeTokenLogin();
    navigation.navigate("Register");
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Profile Screen</Text>
      <Button text="Logout" onPress={onLogout} />
    </View>
  );
}
