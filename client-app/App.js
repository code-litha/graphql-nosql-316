import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AuthProvider from "./context/AuthContext";
import RootStack from "./navigators/RootStack";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          </AuthProvider>
        </ApolloProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
