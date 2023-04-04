// Default or Third Party Library Imports
import React, { useEffect, useRef, useState } from "react";
import {
  useWindowDimensions,
  View,
  StyleSheet,
  ToastAndroid,
  ScrollView,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector, useStore } from "react-redux";

// Custom Imports
import AppTextField from "../components/AppTextField";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import colors from "../config/colors";
import { addUser, setCurrentUser, setUser } from "../features/actions";

export default function LoginPage({ navigation }) {
  //Dispatcher
  const dispatch = useDispatch();

  //Selectors
  const selectUsers = useSelector((state) => state.user.users);

  //Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpOTP, setSignUpOTP] = useState("");
  const [showPasswordLogin, setShowPasswordLogin] = useState(0);
  const [showPasswordSignUp, setShowPasswordSignUp] = useState(0);

  //Util States
  const [currentTab, setCurrentTab] = useState(0);
  const { height, width } = useWindowDimensions();

  //Refs
  const refLoginInput = useRef(null);
  const refSignUpInput = useRef(null);

  let tabMul = currentTab ? 0.282 : 0.3;

  //Get Users
  useEffect(() => {
    async function getUsers() {
      let tries = 3,
        gotUsers = false;

      while (!gotUsers && tries--) {
        await AsyncStorage.getItem("@Users_Array", (err, result) => {
          if (err) return;
          else {
            if (result !== null) {
              dispatch(setUser({ users: JSON.parse(result).Users }));
              gotUsers = true;
            }
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
        if (loginEmail) setLoginEmail("");
        if (loginPassword) setLoginPassword("");
        if (showPasswordLogin) setShowPasswordLogin(0);
      } else {
        if (signUpEmail) setSignUpEmail("");
        if (signUpPassword) setSignUpPassword("");
        if (signUpOTP) setSignUpOTP("");
        if (showPasswordCall) setShowPasswordSignUp(0);
      }
      setCurrentTab(tab);
    }
  };

  const showPasswordCall = (which) => {
    if (which === "Login") setShowPasswordLogin(showPasswordLogin ^ 1);
    else setShowPasswordSignUp(showPasswordSignUp ^ 1);
  };

  const handleLogin = async () => {
    if (loginEmail.trim() === "") {
      ToastAndroid.show("Enter Email", ToastAndroid.SHORT);
      return;
    }
    if (loginPassword.trim() === "") {
      ToastAndroid.show("Enter Password", ToastAndroid.SHORT);
      return;
    }

    let ourUser = { name: "" };
    Object.keys(selectUsers).filter((key) => {
      if (
        selectUsers[key.toString()].email.toLowerCase() ===
          loginEmail.toLowerCase() &&
        selectUsers[key.toString()].password === loginPassword
      )
        ourUser = selectUsers[key];
    });

    // console.log(ourUser);

    if (ourUser.name === "")
      ToastAndroid.show("Invalid Credenials", ToastAndroid.SHORT);
    else {
      setLoginEmail("");
      setLoginPassword("");
      setShowPasswordLogin(0);
      dispatch(setCurrentUser({ user: ourUser }));
      navigation.navigate("HomePage", ourUser);
    }

    // await AsyncStorage.setItem(
    //   `@todosCategories_0.18565659353231381679620611913`,
    //   JSON.stringify(cat)
    // ).then((v) => {
    //   console.log("Done");
    // });
  };

  const handleRegister = async () => {
    if (signUpEmail.trim() === "") {
      ToastAndroid.show("Enter Email", ToastAndroid.SHORT);
      return;
    }
    if (signUpPassword.trim() === "") {
      ToastAndroid.show("Enter Password", ToastAndroid.SHORT);
      return;
    }

    let alreadyResgistered = false;
    for (const key in selectUsers) {
      if (selectUsers[key].email === signUpEmail.toLowerCase()) {
        ToastAndroid.show("User Already Registered", ToastAndroid.SHORT);
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

    let userName = signUpEmail.substring(0, signUpEmail.indexOf("@"));

    let newId = Math.random() * Math.random() + "" + Date.now();
    let newUser = {
      name: userName[0].toUpperCase() + userName.substring(1),
      email: signUpEmail.toLowerCase(),
      password: signUpPassword,
      userId: newId,
    };

    let dataUsers = {};
    dataUsers[newId] = newUser;
    const jsonValue = JSON.stringify({
      Users: { ...selectUsers, ...dataUsers },
    });

    dispatch(
      addUser({
        user: newUser,
      })
    );

    let error = false;
    await AsyncStorage.mergeItem("@Users_Array", jsonValue, (err) => {
      if (err) {
        error = true;
        ToastAndroid.show(
          "Somethong went wrong, Try Again",
          ToastAndroid.SHORT
        );
        return;
      }
    });

    if (!error) {
      ToastAndroid.show("Registeration Successful", ToastAndroid.SHORT);
      switchTab(0);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={[styles.container, { height: height * 1.05 }]}>
        <View style={styles.upperSphere} />
        <View style={styles.lowerSphere} />
        <View
          style={[styles.card, { top: height * tabMul, left: width * 0.075 }]}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => {
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
                onPress={handleLogin}
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
                onPress={handleRegister}
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
