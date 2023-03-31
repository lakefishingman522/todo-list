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
} from "react-native";

// Custom Imports
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppRow from "../components/AppRow";
import AppIcon from "../components/AppIcon";
import AppBar from "../components/AppBar";
import AppChip from "../components/AppChip";
import AppRoundedIcon from "../components/AppRoundedIcon";

function ProfilePage({ navigation, route }) {
  const { width, height } = useWindowDimensions();

  const [statusChips, setStatusChips] = useState([
    { id: 1, title: "🎯 Active", selected: true },
    { id: 2, title: "😴 Away", selected: false },
  ]);

  return (
    <ScrollView style={[styles.container, { width: width, height: height }]}>
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
          <View
            style={[
              styles.circleAvatar,
              {
                width: height * 0.14,
                height: height * 0.14,
                borderRadius: (height * 0.14) / 2,
              },
            ]}
          ></View>
          <View>
            <AppText
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20 / PixelRatio.getFontScale(),
                width: width * 0.35,
              }}
              numberOfLines={1}
            >
              {route.params.user.name}
            </AppText>
            <AppText
              style={{
                color: colors.grey,
                fontSize: 14 / PixelRatio.getFontScale(),
              }}
            >
              Set Profession
            </AppText>
          </View>
          <AppIcon
            iconType="Feather"
            style={{ paddingRight: width * 0.01 }}
            name="edit"
            size={30 / PixelRatio.getFontScale()}
            color="black"
            onPress={() => {
              navigation.navigate("EditProfilePage", route.params.user);
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
                      chip.selected ? { backgroundColor: colors.secondary } : {}
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
            <AppText style={styles.switchAcc}>Switch to Other Account</AppText>
            <AppText
              style={styles.logOut}
              onPress={() => {
                Alert.alert("Are you sure...", "Do you want to Log out?", [
                  {
                    onPress: () => {},
                    text: "No",
                  },
                  {
                    onPress: () => {},
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
    </ScrollView>
  );
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
  circleAvatar: {
    backgroundColor: colors.lightGray,
  },
  card: {
    marginTop: 20,
    backgroundColor: "white",
    marginHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 10,
    elevation: 4,
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
  topBar: {
    alignItems: "center",
  },
});

export default ProfilePage;
