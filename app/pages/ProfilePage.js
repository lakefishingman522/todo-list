// Default or Third Party Library Imports
import React, { Component } from "react";
import {
  PixelRatio,
  StatusBar,
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  Dimensions,
  Switch,
} from "react-native";
import { connect } from "react-redux";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import "react-native-reanimated";

// Custom Imports
import AppText from "../components/AppText";
import AppRow from "../components/AppRow";
import AppIcon from "../components/AppIcon";
import AppBar from "../components/AppBar";
import AppChip from "../components/AppChip";
import AppRoundedIcon from "../components/AppRoundedIcon";
import AppAvatar from "../components/AppAvatar";
import AppLine from "../components/AppLine";
import { CHANGE_ACCOUNT, DELETE_USER, TOGGLE_THEME } from "../features/actions";

const { width, height } = Dimensions.get("window");

class ProfilePage extends Component {
  //States
  constructor(props) {
    super(props);
    this.state = {
      statusChips: [
        { id: 1, title: "🎯 Active", selected: true },
        { id: 2, title: "😴 Away", selected: false },
      ],
      changeAccModelVisible: false,
      languageChips: [
        { id: 1, title: "English", selected: true },
        { id: 2, title: "Tamil", selected: false },
      ],
      theme: props.theme !== "light" ? true : false,
      colors:
        props.theme === "light"
          ? props.themes.lightThemeColors
          : props.themes.darkThemeColors,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.theme !== prevProps.theme) {
      this.setState({
        ...this.state,
        colors:
          this.props.theme === "light"
            ? this.props.themes.lightThemeColors
            : this.props.themes.darkThemeColors,

        theme: !this.state.theme,
      });
    }
  }

  //State Setters
  setStatusChips = (newChips) => {
    this.setState({
      ...this.state,
      statusChips: [...newChips],
    });
  };

  setLangChips = (newChips) => {
    this.setState({
      ...this.state,
      languageChips: [...newChips],
    });
  };

  setChangeAccModelVisible = (value) => {
    this.setState({
      ...this.state,
      changeAccModelVisible: value,
    });
  };

  toggleTheme = () => {
    this.props.changeTheme();
  };

  render() {
    return (
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: this.state.colors.background },
        ]}
      >
        <View style={{ width: width, flexBasis: 1, marginBottom: 50 }}>
          <AppBar
            name="chevron-back"
            size={32}
            iconColor={this.state.colors.text}
            iconType="Ionicons"
            barStyle={{
              backgroundColor: "transparent",
            }}
            onPressIcon={() => {
              this.props.navigation.goBack();
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
            style={[
              styles.card,
              {
                backgroundColor: this.state.colors.card,
                shadowColor: this.state.colors.text,
              },
            ]}
          >
            <AppAvatar
              profileImage={this.props.currentUser.profileImage}
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
                {this.props.currentUser.name}
              </AppText>
              <AppText
                style={{
                  // color: this.state.colors.grey,
                  fontSize: 14 / PixelRatio.getFontScale(),
                }}
              >
                {this.props.currentUser.place
                  ? this.props.currentUser.place
                  : "Set Place"}
              </AppText>
            </View>
            <AppIcon
              iconType="Feather"
              style={{ paddingRight: width * 0.01 }}
              name="edit"
              size={30 / PixelRatio.getFontScale()}
              color={this.state.colors.text}
              onPress={() => {
                this.props.navigation.navigate("EditProfilePage");
              }}
            />
          </AppRow>
          <View style={styles.menu}>
            <AppText
              style={[
                styles.menuTitle,
                {
                  color: this.state.colors.grey,
                },
              ]}
            >
              My Status
            </AppText>
            <AppRow>
              {this.state.statusChips.map((chip, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      this.setStatusChips(
                        this.state.statusChips.filter((c) => {
                          if (chip.id === c.id) c.selected = true;
                          else c.selected = false;

                          return c;
                        })
                      );
                    }}
                  >
                    <AppChip
                      colors={this.state.colors}
                      data={chip}
                      style={
                        chip.selected
                          ? { backgroundColor: this.state.colors.secondary }
                          : {}
                      }
                    />
                  </Pressable>
                );
              })}
            </AppRow>
          </View>
          <View style={styles.menu}>
            <AppText
              style={[
                styles.menuTitle,
                {
                  color: this.state.colors.grey,
                },
              ]}
            >
              Settings
            </AppText>
            <View>
              <MenuRow
                colors={this.state.colors}
                width={width}
                iconName="google-analytics"
                iconType="MaterialCommunityIcons"
                iconBackgroundColor={this.state.colors.primary}
                iconSize={60 / PixelRatio.getFontScale()}
                menuRowTitle="Analysis"
              >
                <AppRow justifyContent="space-between">
                  <AppText style={styles.analysisBar}>Completed</AppText>
                  <AppText style={styles.analysisBar}>Pending</AppText>
                </AppRow>

                <AppRow>
                  {this.props.totalCompleted ? (
                    <View
                      style={[
                        styles.completedBar,
                        {
                          flex:
                            this.props.totalCompleted /
                            (this.props.totalCompleted +
                              this.props.totalPending),

                          backgroundColor: this.state.colors.primary,
                        },
                      ]}
                    >
                      <AppText
                        style={[
                          styles.completedText,
                          { color: this.state.colors.white },
                        ]}
                      >
                        {this.props.totalCompleted}
                      </AppText>
                    </View>
                  ) : null}
                  {this.props.totalPending ? (
                    <View
                      style={[
                        styles.pendingBar,
                        {
                          flex:
                            this.props.totalPending /
                            (this.props.totalCompleted +
                              this.props.totalPending),

                          backgroundColor: this.state.colors.secondary,
                        },
                      ]}
                    >
                      <AppText
                        style={[
                          styles.pendingText,
                          { color: this.state.colors.white },
                        ]}
                      >
                        {this.props.totalPending}
                      </AppText>
                    </View>
                  ) : null}
                </AppRow>

                <AppText>
                  {this.props.totalPending
                    ? `🚀 Still ${this.props.totalPending} Todos... More to Go`
                    : `💙You have completed all ${this.props.totalCompleted} Todos`}
                </AppText>
              </MenuRow>
              <MenuRow
                width={width}
                iconName="sunny"
                iconType="Ionicons"
                colors={this.state.colors}
                iconBackgroundColor={this.state.colors.primary}
                iconSize={60 / PixelRatio.getFontScale()}
                menuRowTitle="Theme"
                rightEnd={
                  <Switch
                    value={this.state.theme}
                    onChange={this.toggleTheme}
                    trackColor={this.state.colors.secondary}
                    thumbColor={this.state.colors.secondary}
                  />
                }
                value={this.state.theme}
              />
              <MenuRow
                colors={this.state.colors}
                width={width}
                iconName="language"
                iconType="MaterialIcons"
                iconBackgroundColor={this.state.colors.primary}
                iconSize={60 / PixelRatio.getFontScale()}
                menuRowTitle="Language"
              >
                <AppRow>
                  {this.state.languageChips.map((chip, index) => {
                    return (
                      <Pressable
                        key={index}
                        onPress={() => {
                          this.setLangChips(
                            this.state.languageChips.filter((c) => {
                              if (chip.id === c.id) c.selected = true;
                              else c.selected = false;

                              return c;
                            })
                          );
                        }}
                      >
                        <AppChip
                          colors={this.state.colors}
                          data={chip}
                          style={
                            chip.selected
                              ? { backgroundColor: this.state.colors.secondary }
                              : {}
                          }
                        />
                      </Pressable>
                    );
                  })}
                </AppRow>
              </MenuRow>
            </View>
          </View>
          <View style={styles.menu}>
            <AppText
              style={[
                styles.menuTitle,
                {
                  color: this.state.colors.grey,
                },
              ]}
            >
              My Account
            </AppText>
            <AppRow justifyContent="space-between" alignItems="center">
              <View>
                <AppText
                  onPress={() => this.setChangeAccModelVisible(true)}
                  style={[
                    styles.switchAcc,
                    {
                      color: this.state.colors.secondary,
                    },
                  ]}
                >
                  Switch to Other Account
                </AppText>
                <AppText
                  style={[
                    styles.logOut,
                    {
                      color: this.state.colors.primary,
                    },
                  ]}
                  onPress={() => {
                    Alert.alert("Are you sure...", "Do you want to Log out?", [
                      {
                        onPress: () => {},
                        text: "No",
                      },
                      {
                        onPress: () => {
                          this.props.navigation.popToTop();
                        },
                        text: "Yes",
                      },
                    ]);
                  }}
                >
                  Log Out
                </AppText>
              </View>
              <AppIcon
                name="delete-outline"
                onPress={() => {
                  Alert.alert(
                    "Are you sure...",
                    "Do you want to Delete this Account? (Note all the Data will be Lost)",
                    [
                      {
                        onPress: () => {},
                        text: "No",
                      },
                      {
                        onPress: () => {
                          this.props.deleteUser({
                            user: this.props.currentUser,
                          });
                          this.props.navigation.popToTop();
                        },
                        text: "Yes",
                      },
                    ]
                  );
                }}
                iconType="MaterialIcons"
                color={this.state.colors.text}
                size={32}
              />
            </AppRow>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.changeAccModelVisible}
          onRequestClose={() => this.setChangeAccModelVisible(false)}
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
                  backgroundColor: this.state.colors.card,
                  shadowColor: this.state.colors.grey,
                  borderColor: this.state.colors.border,
                  borderWidth: 2,
                },
              ]}
            >
              <View>
                <AppRow alignItems="center">
                  <AppIcon
                    iconType="FontAwesome"
                    onPress={() => this.setChangeAccModelVisible(false)}
                    name="close"
                    size={25}
                    color={this.state.colors.text}
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
                        profileImage={this.props.currentUser.profileImage}
                      />
                      <View style={{ marginHorizontal: 15 }}>
                        <AppText style={{ fontFamily: "Poppins_500Medium" }}>
                          {this.props.currentUser.name}
                        </AppText>
                        <AppText style={{ color: this.state.colors.grey }}>
                          {this.props.currentUser.email}
                        </AppText>
                      </View>
                    </AppRow>
                  </View>
                  <AppLine color="black" marginVertical={5} />
                  {Object.keys(this.props.users).map((key, index) => {
                    if (
                      this.props.users[key].userId !==
                      this.props.currentUser.userId
                    )
                      return (
                        <TouchableOpacity
                          key={this.props.users[key].userId}
                          onPress={() => {
                            this.props.changeAccount({
                              store: this.props.store,
                              user: this.props.users[key],
                            });

                            this.props.navigation.goBack();
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
                                profileImage={
                                  this.props.users[key].profileImage
                                }
                              />
                              <View style={{ marginHorizontal: 15 }}>
                                <AppText
                                  style={{ fontFamily: "Poppins_500Medium" }}
                                >
                                  {this.props.users[key].name}
                                </AppText>
                                <AppText
                                  style={{ color: this.state.colors.grey }}
                                >
                                  {this.props.users[key].email}
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    store: state,
    users: state.user.users,
    currentUser: state.user.currentUser,
    totalCompleted: Object.keys(state.todo.completed).length,
    totalPending: Object.keys(state.todo.pending).length,
    themes: state.user.themes,
    theme: state.user.currentUser.theme,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeAccount: (payload) =>
      dispatch({
        type: CHANGE_ACCOUNT,
        payload: payload,
      }),
    changeTheme: () => dispatch({ type: TOGGLE_THEME }),
    deleteUser: (payload) => dispatch({ type: DELETE_USER, payload: payload }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);

//Helpers
function MenuRow({
  width,
  iconName,
  iconType,
  iconBackgroundColor,
  iconSize,
  menuRowTitle,
  rightEnd,
  children,
  value,
  colors,
}) {
  const rotate = useSharedValue(0);
  const animatedStyleRotate = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: rotate.value + "deg",
        },
      ],
    };
  });

  const rotateTrans = useSharedValue(0);
  const animatedStyleRotateTrans = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: rotateTrans.value + "deg",
        },
      ],
    };
  });

  const heightMul = useSharedValue(height * 0.105);
  const animatedStyleHeight = useAnimatedStyle(() => {
    return {
      height: heightMul.value,
      backgroundColor: rotate.value ? colors.card : "transparent",
      borderRadius: rotate.value ? 10 : 0,
    };
  });

  if (value) {
    rotateTrans.value = withTiming(360);
  } else {
    rotateTrans.value = withTiming(0);
  }

  return (
    <Pressable
      onPress={
        !rightEnd
          ? () => {
              rotate.value = withTiming(rotate.value ? 0 : 90);
              heightMul.value = withTiming(
                heightMul.value === height * 0.105
                  ? height * 0.3
                  : height * 0.105
              );
            }
          : () => {}
      }
    >
      <Animated.View style={[{ overflow: "hidden" }, animatedStyleHeight]}>
        <AppRow
          alignItems="center"
          style={[styles.menuRow, { width: width * 0.9 }]}
        >
          {!rightEnd ? (
            <Animated.View style={animatedStyleRotate}>
              <AppRoundedIcon
                name={iconName}
                iconType={iconType}
                backgroundColor={iconBackgroundColor}
                size={iconSize}
              />
            </Animated.View>
          ) : (
            <Animated.View style={animatedStyleRotateTrans}>
              <AppRoundedIcon
                name={!value ? iconName : "moon-sharp"}
                iconType={iconType}
                backgroundColor={iconBackgroundColor}
                size={iconSize}
              />
            </Animated.View>
          )}
          <AppText style={styles.menuRowTitle}>{menuRowTitle}</AppText>
          {!rightEnd ? (
            <Animated.View style={animatedStyleRotate}>
              <AppIcon
                name="chevron-forward"
                iconType="Ionicons"
                color={colors.text}
              />
            </Animated.View>
          ) : (
            rightEnd
          )}
        </AppRow>
        <View style={{ marginHorizontal: 10, marginTop: 20 }}>{children}</View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  analysisBar: { fontSize: 15, fontFamily: "Poppins_600SemiBold" },
  card: {
    marginTop: 20,
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
  completedBar: {
    height: 20,
    marginVertical: 10,
  },
  completedText: { paddingHorizontal: 8 },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  icon: {
    paddingHorizontal: "5%",
  },
  logOut: {
    marginTop: 10,
    fontSize: 17 / PixelRatio.getFontScale(),
    fontFamily: "Poppins_500Medium",
  },
  menuTitle: {
    fontSize: 13 / PixelRatio.getFontScale(),
  },
  menu: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  menuRow: {
    paddingVertical: 12,
    paddingHorizontal: 5,
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
    borderRadius: 10,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pageTitle: {
    fontSize: 18 / PixelRatio.getFontScale(),
    fontFamily: "Poppins_500Medium",
  },
  pendingBar: {
    height: 20,
    marginVertical: 10,
  },
  pendingText: {
    paddingHorizontal: 8,
    alignSelf: "flex-end",
  },
  switchAcc: {
    marginTop: 10,
    fontSize: 17 / PixelRatio.getFontScale(),
    fontFamily: "Poppins_500Medium",
  },
  topBar: {
    alignItems: "center",
  },
});
