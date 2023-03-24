// Default or Third Party Library Imports
import React, { useEffect, useRef, useState } from "react";
import {
  useWindowDimensions,
  View,
  StyleSheet,
  ToastAndroid,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom Imports
import AppTextField from "../components/AppTextField";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import { Pressable } from "react-native";
import AppText from "../components/AppText";
// import axios from "axios";

export default function LoginPage({ navigation }) {
  //States
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

  const refLoginInput = useRef(null);
  const refSignUpInput = useRef(null);

  //Get Users
  useEffect(() => {
    async function getUsers() {
      let tries = 3,
        gotUsers = false;

      // await AsyncStorage.clear();
      while (tries--) {
        await AsyncStorage.getItem("@Users_Array", (err, result) => {
          if (err) return;
          else {
            if (result === null) setUsers([]);
            else setUsers(JSON.parse(result).Users);
            gotUsers = true;
          }
        });
      }

      if (!gotUsers) {
        ToastAndroid.show(
          "Somethong went wrong, Try Again Sometimes later",
          ToastAndroid.SHORT
        );
      }
    }
    getUsers();
  }, []);

  //Handlers
  const switchTab = (tab) => {
    if (tab != currentTab) {
      if (tab) {
        setLoginEmail("");
        setLoginPassword("");
        setShowPasswordLogin(0);
      } else {
        setSignUpEmail("");
        setSignUpPassword("");
        setSignUpOTP("");
        setShowPasswordSignUp(0);
      }
      setCurrentTab(tab);
    }
  };

  const showPasswordCall = (which) => {
    if (which === "Login") setShowPasswordLogin(showPasswordLogin ^ 1);
    else setShowPasswordSignUp(showPasswordSignUp ^ 1);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={[styles.container, { height: height * 1.05 }]}>
        <View style={styles.upperSphere}></View>
        <View style={styles.lowerSphere}></View>
        <View style={[styles.card, { top: height * 0.3, left: width * 0.075 }]}>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                if (signUpEmail !== "") setSignUpEmail("");
                if (signUpPassword !== "") setSignUpPassword("");
                if (signUpOTP !== "") setSignUpOTP("");

                switchTab(0);
              }}
            >
              <AppText
                style={
                  currentTab === 0 ? styles.currentTabText : styles.nextTabText
                }
              >
                LOGIN
              </AppText>
            </Pressable>
            <AppText style={styles.expander}></AppText>
            <Pressable
              onPress={() => {
                if (loginEmail !== "") setLoginEmail("");
                if (loginPassword !== "") setLoginPassword("");

                switchTab(1);
              }}
            >
              <AppText
                style={
                  currentTab === 1 ? styles.currentTabText : styles.nextTabText
                }
              >
                SIGN UP
              </AppText>
            </Pressable>
          </View>
          {currentTab === 0 ? (
            <View style={[styles.loginContainer]}>
              <AppTextField
                ref={refLoginInput}
                iconName="user"
                setValue={setLoginEmail}
                value={loginEmail}
                placeholder="Email"
                style={styles.inputLogin}
              />
              <AppTextField
                type={showPasswordLogin === 0 ? "password" : "text"}
                iconName={showPasswordLogin === 0 ? "lock" : "unlock"}
                setValue={setLoginPassword}
                value={loginPassword}
                placeholder="Password"
                style={styles.inputLogin}
                onPressIcon={() => showPasswordCall("Login")}
              />
              <AppText style={styles.forgetPass}>Forgot Password?</AppText>
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
                    if (
                      user.email.toLowerCase() === loginEmail &&
                      user.password === loginPassword
                    )
                      ourUser = user;
                  });
                  if (ourUser.name === "")
                    ToastAndroid.show("Invalid Credenials", ToastAndroid.SHORT);
                  else {
                    setLoginEmail("");
                    setLoginPassword("");
                    setShowPasswordLogin(0);
                    navigation.navigate("HomePage", ourUser);
                  }
                }}
              ></AppButton>
            </View>
          ) : (
            <View style={styles.loginContainer}>
              <AppTextField
                ref={refSignUpInput}
                iconName="user"
                setValue={setSignUpEmail}
                value={signUpEmail}
                placeholder="Email"
                style={styles.inputLogin}
              />
              <AppTextField
                type={showPasswordSignUp === 0 ? "password" : "text"}
                iconName={showPasswordSignUp === 0 ? "lock" : "unlock"}
                setValue={setSignUpPassword}
                value={signUpPassword}
                placeholder="Password"
                style={styles.inputLogin}
                onPressIcon={() => showPasswordCall("SignUp")}
              />
              <AppTextField
                iconName="check-circle-o"
                setValue={setSignUpOTP}
                value={signUpOTP}
                placeholder="OTP"
                style={styles.inputLogin}
              />
              <AppButton
                style={styles.loginButton}
                title="Register"
                onPress={async () => {
                  if (signUpEmail.trim() === "") {
                    ToastAndroid.show("Enter Email", ToastAndroid.SHORT);
                    return;
                  }
                  if (signUpPassword.trim() === "") {
                    ToastAndroid.show("Enter Password", ToastAndroid.SHORT);
                    return;
                  }

                  let alreadyResgistered = false;
                  for (const user of users) {
                    if (user.email === signUpEmail) {
                      ToastAndroid.show(
                        "User Already Registered",
                        ToastAndroid.SHORT
                      );
                      alreadyResgistered = true;
                      break;
                    }
                  }
                  if (alreadyResgistered) return;

                  let pattern = /^[\w\.]+@gmail\.com$/g;
                  if (signUpEmail.match(pattern) === null) {
                    ToastAndroid.show("Invalid Email", ToastAndroid.SHORT);
                    return;
                  }

                  let userName = signUpEmail.substring(
                    0,
                    signUpEmail.indexOf("@")
                  );

                  let newUser = {
                    name: userName[0].toUpperCase() + userName.substring(1),
                    email: signUpEmail.toLowerCase(),
                    password: signUpPassword,
                    userId: Math.random() * Math.random() + "" + Date.now(),
                  };
                  users.push(newUser);

                  const jsonValue = JSON.stringify({ Users: users });

                  let error = false;
                  await AsyncStorage.mergeItem(
                    "@Users_Array",
                    jsonValue,
                    (err) => {
                      if (err) {
                        error = true;
                        ToastAndroid.show(
                          "Somethong went wrong, Try Again",
                          ToastAndroid.SHORT
                        );
                        return;
                      }
                    }
                  );

                  if (!error) {
                    ToastAndroid.show(
                      "Registeration Successful",
                      ToastAndroid.SHORT
                    );
                    setUsers([...users]);
                    switchTab(0);
                  }
                }}
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

//StyleSheet
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
    fontFamily: "Poppins_700Bold",
  },
  inputLogin: {
    marginVertical: 10,
  },
  expander: { flex: 8 },
  forgetPass: {
    marginVertical: 20,
    color: colors.grey,
    fontFamily: "Poppins_500Medium",
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
    fontFamily: "Poppins_500Medium",
    color: colors.grey,
  },
  scrollView: { height: "100%" },
  upperSphere: {
    width: "100%",
    height: 250,
    backgroundColor: colors.primary,
    borderBottomEndRadius: 200,
  },
});
