// Default or Third Party Library Imports
import React, { useState } from "react";
import {
  PixelRatio,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Custom Imports
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppRow from "../components/AppRow";
import AppIcon from "../components/AppIcon";
import AppBar from "../components/AppBar";
import AppChip from "../components/AppChip";
import AppRoundedIcon from "../components/AppRoundedIcon";
import AppAvatar from "../components/AppAvatar";
import AppLine from "../components/AppLine";

function ProfilePage({ navigation, route }) {
  //Store
  const store = useStore();

  //Selectors
  const { users, currentUser } = useSelector((state) => state.user);
  console.log(users);
  //Dispatch
  const dispatcher = useDispatch();

  //Utils
  const { width, height } = useWindowDimensions();
  const [statusChips, setStatusChips] = useState([
    { id: 1, title: "🎯 Active", selected: true },
    { id: 2, title: "😴 Away", selected: false },
  ]);
  const [changeAccModelVisible, setChangeAccModelVisible] = useState(false);

  //Listener For Page Focusing
  const isFocused = useIsFocused();

  if (isFocused) {
    return (
      <GestureHandlerRootView>
        <ScrollView
          style={[styles.container, { width: width, height: height * 1.1 }]}
        >
          <View>
            <AppBar
              name="chevron-back"
              size={32}
              color="black"
              iconType="Ionicons"
              barStyle={{
                backgroundColor: "transparent",
              }}
              onPressIcon={() => {
                navigation.goBack();
              }}
            >
              <View
                style={{ flex: 1, alignItems: "flex-end", paddingRight: "37%" }}
              >
                <AppText style={styles.pageTitle}>My Profile</AppText>
              </View>
            </AppBar>
            <AppRow
              justifyContent="space-around"
              alignItems="center"
              style={styles.card}
            >
              <AppAvatar
                profileImage={currentUser.profileImage}
                size={height * 0.14}
              />
              <View>
                <AppText
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 20 / PixelRatio.getFontScale(),
                    width: width * 0.35,
                  }}
                  numberOfLines={1}
                >
                  {currentUser.name}
                </AppText>
                <AppText
                  style={{
                    color: colors.grey,
                    fontSize: 14 / PixelRatio.getFontScale(),
                  }}
                >
                  {currentUser.place ? currentUser.place : "Set Place"}
                </AppText>
              </View>
              <AppIcon
                iconType="Feather"
                style={{ paddingRight: width * 0.01 }}
                name="edit"
                size={30 / PixelRatio.getFontScale()}
                color="black"
                onPress={() => {
                  navigation.navigate("EditProfilePage");
                }}
              />
            </AppRow>
            <View style={styles.menu}>
              <AppText style={styles.menuTitle}>My Status</AppText>
              <AppRow>
                {statusChips.map((chip, index) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        setStatusChips(
                          statusChips.filter((c) => {
                            if (chip.id === c.id) c.selected = true;
                            else c.selected = false;

                            return c;
                          })
                        );
                      }}
                    >
                      <AppChip
                        data={chip}
                        style={
                          chip.selected
                            ? { backgroundColor: colors.secondary }
                            : {}
                        }
                      />
                    </Pressable>
                  );
                })}
              </AppRow>
            </View>

            <View style={styles.menu}>
              <AppText style={styles.menuTitle}>Settings</AppText>
              <View>
                <MenuRow
                  width={width}
                  iconName="calendar-star"
                  iconType="MaterialCommunityIcons"
                  iconBackgroundColor={colors.primary}
                  iconSize={60 / PixelRatio.getFontScale()}
                  menuRowTitle="Achievements"
                />
                <MenuRow
                  width={width}
                  iconName="settings"
                  iconType="MaterialIcons"
                  iconBackgroundColor={colors.primary}
                  iconSize={60 / PixelRatio.getFontScale()}
                  menuRowTitle="Settings"
                />
              </View>
            </View>
            <View style={styles.menu}>
              <AppText style={styles.menuTitle}>My Account</AppText>
              <View>
                <AppText
                  onPress={() => setChangeAccModelVisible(true)}
                  style={styles.switchAcc}
                >
                  Switch to Other Account
                </AppText>
                <AppText
                  style={styles.logOut}
                  onPress={() => {
                    Alert.alert("Are you sure...", "Do you want to Log out?", [
                      {
                        onPress: () => {},
                        text: "No",
                      },
                      {
                        onPress: () => {
                          navigation.popToTop();
                        },
                        text: "Yes",
                      },
                    ]);
                  }}
                >
                  Log Out
                </AppText>
              </View>
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={changeAccModelVisible}
            onRequestClose={() => setChangeAccModelVisible(false)}
          >
            <View
              style={[
                styles.centeredView,
                {
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  marginVertical: width * 0.35,
                },
              ]}
            >
              <View
                style={[
                  styles.modalView,
                  {
                    width: width * 0.9,
                    height: height * 0.7,
                    alignSelf: "center",
                    overflow: "hidden",
                  },
                ]}
              >
                <View>
                  <AppRow alignItems="center">
                    <AppIcon
                      iconType="FontAwesome"
                      onPress={() => setChangeAccModelVisible(false)}
                      name="close"
                      size={25}
                      color={colors.black}
                      style={{ marginRight: 15 }}
                    />
                    <AppText
                      style={{
                        fontFamily: "Poppins_700Bold",
                        fontSize: 20,
                        marginTop: 5,
                      }}
                    >
                      Accounts
                    </AppText>
                  </AppRow>

                  <ScrollView style={{ marginBottom: 20 }}>
                    <View
                      style={{
                        width: "100%",
                        height: 50,
                        marginVertical: 10,
                      }}
                    >
                      <AppRow alignItems="center">
                        <AppAvatar
                          size={48}
                          profileImage={currentUser.profileImage}
                        />
                        <View style={{ marginHorizontal: 15 }}>
                          <AppText style={{ fontFamily: "Poppins_500Medium" }}>
                            {currentUser.name}
                          </AppText>
                          <AppText style={{ color: colors.grey }}>
                            {currentUser.email}
                          </AppText>
                        </View>
                      </AppRow>
                    </View>
                    <AppLine color="black" marginVertical={5} />
                    {Object.keys(users).map((key, index) => {
                      if (users[key].userId !== currentUser.userId)
                        return (
                          <TouchableOpacity
                            key={users[key].userId}
                            onPress={() => {
                              dispatcher({
                                type: "CHANGE_ACCOUNT",
                                payload: {
                                  store: store.getState(),
                                  user: users[key],
                                },
                              });

                              navigation.goBack();
                            }}
                          >
                            <View
                              style={{
                                width: "100%",
                                height: 50,
                                marginVertical: 10,
                              }}
                            >
                              <AppRow alignItems="center">
                                <AppAvatar
                                  size={48}
                                  profileImage={users[key].profileImage}
                                />
                                <View style={{ marginHorizontal: 15 }}>
                                  <AppText
                                    style={{ fontFamily: "Poppins_500Medium" }}
                                  >
                                    {users[key].name}
                                  </AppText>
                                  <AppText style={{ color: colors.grey }}>
                                    {users[key].email}
                                  </AppText>
                                </View>
                              </AppRow>
                            </View>
                          </TouchableOpacity>
                        );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </GestureHandlerRootView>
    );
  }
}

//Helpers
function MenuRow({
  width,
  iconName,
  iconType,
  iconBackgroundColor,
  iconSize,
  menuRowTitle,
}) {
  return (
    <AppRow
      alignItems="center"
      style={[styles.menuRow, { width: width * 0.9 }]}
    >
      <AppRoundedIcon
        name={iconName}
        iconType={iconType}
        backgroundColor={iconBackgroundColor}
        size={iconSize}
      />
      <AppText style={styles.menuRowTitle}>{menuRowTitle}</AppText>
      <AppIcon style={{ flex: 1 }} name="chevron-forward" iconType="Ionicons" />
    </AppRow>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    backgroundColor: "white",
    marginHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 10,
    elevation: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  icon: {
    paddingHorizontal: "5%",
  },
  logOut: {
    marginTop: 15,
    color: colors.primary,
    fontSize: 17 / PixelRatio.getFontScale(),
    fontFamily: "Poppins_500Medium",
  },
  switchAcc: {
    marginTop: 10,
    color: colors.secondary,
    fontSize: 17 / PixelRatio.getFontScale(),
    fontFamily: "Poppins_500Medium",
  },
  pageTitle: {
    fontSize: 18 / PixelRatio.getFontScale(),
    fontFamily: "Poppins_500Medium",
  },
  menuTitle: {
    color: colors.grey,
    fontSize: 13 / PixelRatio.getFontScale(),
  },
  menu: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  menuRow: {
    paddingVertical: 12,
  },
  menuRowTitle: {
    flex: 8,
    marginHorizontal: 20,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15 / PixelRatio.getFontScale(),
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "Poppins_700Bold",
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  topBar: {
    alignItems: "center",
  },
});

export default ProfilePage;
