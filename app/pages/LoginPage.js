// Default or Third Party Library Imports
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ToastAndroid,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom Imports
import AppTextField from "../components/AppTextField";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import { ADD_USER, FETCH_USER, SET_CURRENT_USER } from "../features/actions";
import { StatusBar } from "react-native";
import colors from "../config/colors";

// Dimensions
const { height, width } = Dimensions.get("window");

class LoginPage extends Component {
  //States
  constructor(props) {
    super(props);
    this.state = {
      loginEmail: "",
      loginPassword: "",
      signUpEmail: "",
      signUpPassword: "",
      signUpOTP: "",
      users: props.selectUsers,
      currentTab: 0,
      showPasswordLogin: 0,
      showPasswordSignUp: 0,
    };
  }

  //get Users
  componentDidMount() {
    if (!this.props.fetchedUsers) this.props.fetchUser();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevState.users) != JSON.stringify(this.props.selectUsers)
    ) {
      this.setUsers(this.props.selectUsers);
    }
  }

  //State Setters
  setLoginEmail = (newText) => {
    this.setState({
      ...this.state,
      loginEmail: newText,
    });
  };

  setLoginPassword = (newText) => {
    this.setState({
      ...this.state,
      loginPassword: newText,
    });
  };

  setSignUpEmail = (newText) => {
    this.setState({
      ...this.state,
      signUpEmail: newText,
    });
  };

  setSignUpPassword = (newText) => {
    this.setState({
      ...this.state,
      signUpPassword: newText,
    });
  };

  setSignUpOTP = (newText) => {
    this.setState({
      ...this.state,
      signUpOTP: newText,
    });
  };

  setUsers = (newUsers) => {
    this.setState({
      ...this.state,
      users: newUsers,
    });
  };

  setShowPasswordLogin = (newFlag) => {
    this.setState({
      ...this.state,
      showPasswordLogin: newFlag,
    });
  };

  setShowPasswordSignUp = (newFlag) => {
    this.setState({
      ...this.state,
      showPasswordSignUp: newFlag,
    });
  };

  //Handlers
  switchTab = (tab) => {
    if (tab != this.state.currentTab) {
      if (tab) {
        this.setState({
          ...this.state,
          loginEmail: "",
          loginPassword: "",
          showPasswordLogin: 0,
          currentTab: tab,
        });
      } else {
        this.setState({
          ...this.state,
          signUpEmail: "",
          signUpPassword: "",
          signUpOTP: "",
          showPasswordSignUp: 0,
          currentTab: tab,
        });
      }
    }
  };

  showPasswordCall = (which) => {
    if (which === "Login")
      this.setShowPasswordLogin(this.state.showPasswordLogin ^ 1);
    else this.setShowPasswordSignUp(this.state.showPasswordSignUp ^ 1);
  };

  handleLogin = () => {
    if (this.state.loginEmail.trim() === "") {
      ToastAndroid.show("Enter Email", ToastAndroid.SHORT);
      return;
    }
    if (this.state.loginPassword.trim() === "") {
      ToastAndroid.show("Enter Password", ToastAndroid.SHORT);
      return;
    }

    let ourUser = { name: "" };
    Object.keys(this.state.users).forEach((key) => {
      if (
        this.state.users[key].email.toLowerCase() ===
        this.state.loginEmail.toLowerCase()
      )
        ourUser = this.state.users[key];
    });
    if (ourUser.name === "")
      ToastAndroid.show("Invalid Credenials", ToastAndroid.SHORT);
    else {
      this.setState({
        ...this.state,
        loginEmail: "",
        loginPassword: "",
        showPasswordLogin: 0,
      });
      this.props.setCurrentUser({ user: ourUser });
      this.props.navigation.navigate("HomePage");
    }
  };

  handleSignUp = async () => {
    if (this.state.signUpEmail.trim() === "") {
      ToastAndroid.show("Enter Email", ToastAndroid.SHORT);
      return;
    }
    if (this.state.signUpPassword.trim() === "") {
      ToastAndroid.show("Enter Password", ToastAndroid.SHORT);
      return;
    }

    let alreadyResgistered = false;
    for (const key in this.state.users) {
      if (
        this.state.users[key].email === this.state.signUpEmail.toLowerCase()
      ) {
        ToastAndroid.show("User Already Registered", ToastAndroid.SHORT);
        alreadyResgistered = true;
        break;
      }
    }
    if (alreadyResgistered) return;

    let pattern = /^[\w\.]+@gmail\.com$/g;
    if (this.state.signUpEmail.match(pattern) === null) {
      ToastAndroid.show("Invalid Email", ToastAndroid.SHORT);
      return;
    }

    let userName = this.state.signUpEmail.substring(
      0,
      this.state.signUpEmail.indexOf("@")
    );

    let newId = Math.random() * Math.random() + "-" + Date.now();
    let newUser = {
      name: userName[0].toUpperCase() + userName.substring(1),
      email: this.state.signUpEmail.toLowerCase(),
      password: this.state.signUpPassword,
      userId: newId,
      theme: "light",
    };

    let dataUsers = {};
    dataUsers[newId] = newUser;

    const jsonValue = JSON.stringify({
      ...this.state.users,
      ...dataUsers,
    });

    this.props.addUser({ user: newUser });

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
      this.setState({
        ...this.state,
        currentTab: 0,
      });
    }
  };

  render() {
    console.log(this.state.users);
    return (
      <ScrollView style={styles.scrollView}>
        <StatusBar
          translucent={true}
          animated={true}
          backgroundColor={"transparent"}
          barStyle={"dark-content"}
        />
        <View
          style={[
            styles.container,
            {
              height: height * 1.05,
            },
          ]}
        >
          <View
            style={[styles.upperSphere, { backgroundColor: colors.primary }]}
          />
          <View
            style={[styles.lowerSphere, { backgroundColor: colors.secondary }]}
          />
          <View
            style={[
              styles.card,
              {
                top: height * 0.3,
                left: width * 0.075,
                backgroundColor: colors.white,
              },
            ]}
          >
            <View style={styles.header}>
              <Pressable
                onPress={() => {
                  this.switchTab(0);
                }}
              >
                <AppText
                  style={
                    this.state.currentTab === 0
                      ? styles.currentTabText
                      : styles.nextTabText
                  }
                >
                  LOGIN
                </AppText>
              </Pressable>
              <AppText style={styles.expander}></AppText>
              <Pressable
                onPress={() => {
                  this.switchTab(1);
                }}
              >
                <AppText
                  style={
                    this.state.currentTab === 1
                      ? styles.currentTabText
                      : styles.nextTabText
                  }
                >
                  SIGN UP
                </AppText>
              </Pressable>
            </View>
            {this.state.currentTab === 0 ? (
              <View style={[styles.loginContainer]}>
                <AppTextField
                  // ref={refLoginInput}
                  iconName="user"
                  setValue={(newText) => this.setLoginEmail(newText)}
                  value={this.state.loginEmail}
                  placeholder="Email"
                  style={styles.inputLogin}
                />
                <AppTextField
                  type={
                    this.state.showPasswordLogin === 0 ? "password" : "text"
                  }
                  iconName={
                    this.state.showPasswordLogin === 0 ? "lock" : "unlock"
                  }
                  setValue={this.setLoginPassword}
                  value={this.state.loginPassword}
                  placeholder="Password"
                  style={styles.inputLogin}
                  onPressIcon={() => this.showPasswordCall("Login")}
                />
                <AppText style={[styles.forgetPass, { color: colors.grey }]}>
                  Forgot Password?
                </AppText>
                <AppButton
                  style={styles.loginButton}
                  title="Login"
                  onPress={this.handleLogin}
                  // onPress={async () => {
                  //   await AsyncStorage.clear().then((v) => console.log("Done"));
                  // }}
                />
              </View>
            ) : (
              <View style={styles.loginContainer}>
                <AppTextField
                  // ref={refSignUpInput}
                  iconName="user"
                  setValue={this.setSignUpEmail}
                  value={this.state.signUpEmail}
                  placeholder="Email"
                  style={styles.inputLogin}
                />
                <AppTextField
                  type={
                    this.state.showPasswordSignUp === 0 ? "password" : "text"
                  }
                  iconName={
                    this.state.showPasswordSignUp === 0 ? "lock" : "unlock"
                  }
                  setValue={this.setSignUpPassword}
                  value={this.state.signUpPassword}
                  placeholder="Password"
                  style={styles.inputLogin}
                  onPressIcon={() => this.showPasswordCall("SignUp")}
                />
                <AppTextField
                  iconName="check-circle-o"
                  setValue={this.setSignUpOTP}
                  value={this.state.signUpOTP}
                  placeholder="OTP"
                  style={styles.inputLogin}
                />
                <AppButton
                  style={styles.loginButton}
                  title="Register"
                  onPress={this.handleSignUp}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectUsers: state.user.users,
    fetchedUsers: state.user.isFetched,
    themes: state.user.themes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: () => dispatch({ type: FETCH_USER }),
    setCurrentUser: (content) =>
      dispatch({
        type: SET_CURRENT_USER,
        payload: content,
      }),
    addUser: (content) => dispatch({ type: ADD_USER, payload: content }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

//StyleSheet
const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    position: "absolute",
    width: "85%",
    height: "50%",
    elevation: 20,
    padding: 24,
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
    color: colors.black,
  },
  inputLogin: {
    marginVertical: 10,
  },
  expander: { flex: 8 },
  forgetPass: {
    marginVertical: 20,
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
    borderBottomEndRadius: 200,
  },
});
