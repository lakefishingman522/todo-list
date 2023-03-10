import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  useWindowDimensions,
  View,
  StyleSheet,
  ToastAndroid,
} from "react-native";

import AppTextField from "../components/AppTextField";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import axios from "axios";

export default function LoginPage({ navigation }) {
  const { height, width } = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let users = [];

  useEffect(() => {
    async function getUsers() {
      const user = await axios("https://jsonplaceholder.typicode.com/users");
      users = user.data;
    }
    getUsers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.image}></View>
      <View style={styles.content}></View>
      <View
        style={[
          styles.loginContainer,
          { top: height * 0.3, left: width * 0.075 },
        ]}
      >
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>LOGIN</Text>
          <Text style={{ flex: 8 }}></Text>
          <Text style={styles.signUpText}>SIGN UP</Text>
        </View>
        <AppTextField
          iconName="user"
          setValue={setEmail}
          value={email}
          placeholder="Email"
          style={{
            marginVertical: 10,
          }}
        />
        <AppTextField
          type="password"
          iconName="lock"
          setValue={setPassword}
          value={password}
          placeholder="Password"
          style={{
            marginVertical: 10,
          }}
        />
        <Text style={styles.forgetPass}>Forgot Password?</Text>
        <AppButton
          style={{
            height: "12.5%",
            borderRadius: 2,
            marginVertical: 20,
          }}
          title="Login"
          onPress={() => {
            if (email.trim() === "") {
              ToastAndroid.show("Enter Email", ToastAndroid.SHORT);
              return;
            }
            if (password.trim() === "") {
              ToastAndroid.show("Enter Password", ToastAndroid.SHORT);
              return;
            }
            console.log(email);
            let ourUser = {};
            // users.forEach((user) => {
            //   console.log(user);
            //   // if (user.email === email) ourUser = user;
            // });

            console.log(users);
          }}
        ></AppButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 0.3,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 200,
  },
  forgetPass: {
    marginVertical: 20,
    color: colors.grey,
    fontWeight: 500,
  },
  image: {
    flex: 0.3,
    backgroundColor: colors.primary,
    borderBottomEndRadius: 200,
  },
  loginContainer: {
    flexDirection: "column",
    position: "absolute",
    width: "85%",
    height: "50%",
    elevation: 20,
    padding: 24,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  loginText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  signUpText: {
    fontSize: 18,
    fontWeight: 500,
    color: colors.grey,
  },
});
