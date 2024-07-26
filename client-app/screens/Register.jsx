import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import { useMutation } from "@apollo/client";
import { MUTATION_REGISTER } from "../config/queries";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [funcRegister, { data, loading, error }] = useMutation(
    MUTATION_REGISTER,
    {
      onCompleted: (response) => {
        setForm({
          username: "",
          email: "",
          password: "",
        });
        setUsername("");
        setEmail("");
        setPassword("");
        navigation.navigate("Login");
      },
    }
  );

  const onChangeForm = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const onSubmit = async () => {
    try {
      await funcRegister({
        variables: {
          payload: {
            username: form.username,
            email: form.email,
            password: form.password,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.header]}>Sign Up</Text>

      {/* --- FORM --- */}
      <View style={[styles.boxForm]}>
        <View style={[styles.boxInput]}>
          <Text>Username</Text>
          <TextInput
            style={[styles.textInput]}
            value={form.username}
            onChangeText={(val) => onChangeForm("username", val)}
          />
        </View>

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
      <Button
        text="Submit"
        stylesButton={{ width: "40%", borderRadius: 20 }}
        onPress={onSubmit}
      />

      <View style={[styles.boxLinkLogin]}>
        <Text>Already have an account ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.textLinkLogin]}>Sign In</Text>
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
  boxLinkLogin: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  textLinkLogin: {
    color: "red",
    fontWeight: "500",
  },
});
