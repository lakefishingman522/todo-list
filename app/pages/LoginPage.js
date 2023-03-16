import React, { useEffect, useState } from "react";
import {
  Text,
  useWindowDimensions,
  View,
  StyleSheet,
  ToastAndroid,
  ScrollView,
} from "react-native";

import AppTextField from "../components/AppTextField";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import axios from "axios";
import { Pressable } from "react-native";

export default function LoginPage({ navigation }) {
  const { height, width } = useWindowDimensions();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpOTP, setSignUpOTP] = useState("");
  const [users, setUsers] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [showPasswordLogin, setShowPasswordLogin] = useState(0);
  const [showPasswordSignUp, setShowPasswordSignUp] = useState(0);

  useEffect(() => {
    async function getUsers() {
      const user = await axios("https://jsonplaceholder.typicode.com/users");
      setUsers([...user.data]);
    }
    getUsers();
  }, []);

  const switchTab = (tab) => {
    setCurrentTab(tab);
  };

  const showPasswordCall = (which) => {
    if (which === "Login") setShowPasswordLogin(showPasswordLogin ^ 1);
    else setShowPasswordSignUp(showPasswordSignUp ^ 1);
  };

  return (
    <ScrollView style={{ height: "100%" }}>
      <View style={[styles.container, { height: height * 1.05 }]}>
        <View style={styles.upperSphere}></View>
        <View style={styles.lowerSphere}></View>
        <View style={[styles.card, { top: height * 0.3, left: width * 0.075 }]}>
          <View style={styles.header}>
            <Pressable onPress={() => switchTab(0)}>
              <Text
                style={
                  currentTab === 0 ? styles.currentTabText : styles.nextTabText
                }
              >
                LOGIN
              </Text>
            </Pressable>
            <Text style={{ flex: 8 }}></Text>
            <Pressable onPress={() => switchTab(1)}>
              <Text
                style={
                  currentTab === 1 ? styles.currentTabText : styles.nextTabText
                }
              >
                SIGN UP
              </Text>
            </Pressable>
          </View>
          {currentTab === 0 ? (
            <View style={[styles.loginContainer]}>
              <AppTextField
                iconName="user"
                setValue={setLoginEmail}
                value={loginEmail}
                placeholder="Email"
                style={{
                  marginVertical: 10,
                }}
              />
              <AppTextField
                type={showPasswordLogin === 0 ? "password" : "text"}
                iconName={showPasswordLogin === 0 ? "lock" : "unlock"}
                setValue={setLoginPassword}
                value={loginPassword}
                placeholder="Password"
                style={{
                  marginVertical: 10,
                }}
                onPressIcon={() => showPasswordCall("Login")}
              />
              <Text style={styles.forgetPass}>Forgot Password?</Text>
              <AppButton
                style={styles.loginButton}
                title="Login"
                onPress={() => {
                  if (loginEmail.trim() === "") {
                    ToastAndroid.show("Enter Email", ToastAndroid.SHORT);
                    return;
                  }
                  if (loginPassword.trim() === "") {
                    ToastAndroid.show("Enter Password", ToastAndroid.SHORT);
                    return;
                  }

                  let ourUser = { name: "" };
                  users.forEach((user) => {
                    if (user.email.toLowerCase() === loginEmail) ourUser = user;
                  });
                  if (ourUser.name === "")
                    ToastAndroid.show("Invalid Credenials", ToastAndroid.SHORT);
                  else {
                    setLoginEmail("");
                    setLoginPassword("");
                    navigation.navigate("HomePage", ourUser);
                  }
                }}
              ></AppButton>
            </View>
          ) : (
            <View style={styles.loginContainer}>
              <AppTextField
                iconName="user"
                setValue={setSignUpEmail}
                value={signUpEmail}
                placeholder="Email"
                style={{
                  marginVertical: 10,
                }}
              />
              <AppTextField
                type={showPasswordSignUp === 0 ? "password" : "text"}
                iconName={showPasswordSignUp === 0 ? "lock" : "unlock"}
                setValue={setSignUpPassword}
                value={signUpPassword}
                placeholder="Password"
                style={{
                  marginVertical: 10,
                }}
                onPressIcon={() => showPasswordCall("SignUp")}
              />
              <AppTextField
                iconName="check-circle-o"
                setValue={setSignUpOTP}
                value={signUpOTP}
                placeholder="OTP"
                style={{
                  marginVertical: 10,
                }}
              />
              <AppButton
                style={styles.loginButton}
                title="Register"
                onPress={() => {
                  if (loginEmail.trim() === "") {
                    ToastAndroid.show("Enter Email", ToastAndroid.SHORT);
                    return;
                  }
                  if (loginPassword.trim() === "") {
                    ToastAndroid.show("Enter Password", ToastAndroid.SHORT);
                    return;
                  }

                  let ourUser = { name: "" };
                  users.forEach((user) => {
                    if (user.email === loginEmail) ourUser = user;
                  });
                  if (ourUser.name === "")
                    ToastAndroid.show("Invalid Credenials", ToastAndroid.SHORT);
                  else {
                    setLoginEmail("");
                    setLoginPassword("");
                    navigation.navigate("HomePage", ourUser);
                  }
                }}
              ></AppButton>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    position: "absolute",
    width: "85%",
    height: "50%",
    elevation: 20,
    padding: 24,
    backgroundColor: colors.white,
    alignItems: "center",
    borderRadius: 8,
  },
  container: {
    width: "100%",
    justifyContent: "space-between",
  },
  currentTabText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  forgetPass: {
    marginVertical: 20,
    color: colors.grey,
    fontWeight: 500,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  lowerSphere: {
    width: "100%",
    height: 250,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 200,
  },
  loginContainer: { width: "100%", alignItems: "center" },
  loginButton: {
    height: "12.5%",
    borderRadius: 3,
    marginVertical: 20,
  },
  nextTabText: {
    fontSize: 18,
    fontWeight: 500,
    color: colors.grey,
  },
  upperSphere: {
    width: "100%",
    height: 250,
    backgroundColor: colors.primary,
    borderBottomEndRadius: 200,
  },
});
