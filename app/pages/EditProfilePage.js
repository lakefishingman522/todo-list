// Default or Third Party Library Imports
import React, { useState } from "react";
import {
  PixelRatio,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
  ScrollView,
} from "react-native";

// Custom Imports
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppBar from "../components/AppBar";
import AppIcon from "../components/AppIcon";
import AppRow from "../components/AppRow";

function EditProfilePage({ navigation, route }) {
  console.log("Here");
  const { width, height } = useWindowDimensions();

  return (
    <ScrollView style={{ width: width, height: height }}>
      <View style={styles.container}>
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
            <AppText style={styles.pageTitle}>Edit Profile</AppText>
          </View>
        </AppBar>
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
        <AppRow
          justifyContent="space-around"
          alignItems="center"
          style={styles.card}
        >
          <View>
            <AppText
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20 / PixelRatio.getFontScale(),
                width: width * 0.35,
              }}
              numberOfLines={1}
            >
              {route.params.name}
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
          />
        </AppRow>
      </View>
    </ScrollView>
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
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  icon: {
    paddingHorizontal: "5%",
  },
  logOut: {
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

export default EditProfilePage;
