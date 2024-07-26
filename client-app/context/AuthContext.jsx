import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";

async function saveToken(value = "") {
  return await SecureStore.setItemAsync("token", value);
}

async function getToken() {
  return await SecureStore.getItemAsync("token");
}

export const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  setTokenLogin: async (token = "") => {},
  removeTokenLogin: async () => {},
});

export default function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // getToken().then((data) => {
    //   setToken(data ? data : "");
    //   setIsLoggedIn(data ? true : false);
    // });
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const data = await getToken();
      if (data) {
        setToken(data);
        setIsLoggedIn(true);
      } else {
        setToken("");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log({ token, isLoggedIn }, "<<< token");

  const setTokenLogin = async (value) => {
    try {
      await saveToken(value);
      setToken(value);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const removeTokenLogin = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setToken("");
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        setTokenLogin,
        removeTokenLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
