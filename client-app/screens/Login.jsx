import { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@apollo/client";
import { MUTATION_LOGIN } from "../config/queries";

export default function LoginScreen({ navigation }) {
  const { setTokenLogin } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loginFunc, { data, loading, error }] = useMutation(MUTATION_LOGIN, {
    onCompleted: async (res) => {
      const token = res?.login?.token || "";
      if (token) {
        await setTokenLogin(token);
        navigation.navigate("Home");
      }
    },
  });

  const onChangeForm = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const onSubmit = async () => {
    try {
      await loginFunc({
        variables: {
          email: form.email,
          password: form.password,
        },
      });
    } catch (error) {
      console.log(error);
    }
    // console.log(form, "<<< submit form");
    // await setTokenLogin("ini token");
    // navigation.navigate("Home");
  };

  // if (loading) {
  //   return <ActivityIndicator />;
  // }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.header]}>Sign In</Text>

      {/* --- FORM --- */}
      <View style={[styles.boxForm]}>
        <View style={[styles.boxInput]}>
          <Text>Email</Text>
          <TextInput
            style={[styles.textInput]}
            value={form.email}
            onChangeText={(val) => onChangeForm("email", val)}
            textContentType={"email"}
          />
        </View>

        <View style={[styles.boxInput]}>
          <Text>Password</Text>
          <TextInput
            style={[styles.textInput]}
            value={form.password}
            onChangeText={(val) => onChangeForm("password", val)}
            textContentType={"password"}
          />
        </View>
      </View>

      {/* --- BUTTON --- */}
      {loading ? (
        <ActivityIndicator size={"large"} color={"red"} />
      ) : (
        <Button
          text="Login"
          stylesButton={{ width: "40%", borderRadius: 20 }}
          onPress={onSubmit}
        />
      )}

      <View style={[styles.boxLinkSignUp]}>
        <Text>Don't have an account ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={[styles.textLinkSignUp]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
  },
  boxForm: {
    width: "100%",
    marginVertical: 25,
  },
  boxInput: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  textInput: {
    height: 40,
    marginVertical: 5,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  boxLinkSignUp: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  textLinkSignUp: {
    color: "red",
    fontWeight: "500",
  },
});
