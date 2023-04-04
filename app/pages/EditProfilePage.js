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
import { TextInput, useTheme } from "react-native-paper";
import { Formik, useFormikContext } from "formik";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
} from "@expo-google-fonts/poppins";

// Custom Imports
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppBar from "../components/AppBar";
import AppRoundedIcon from "../components/AppRoundedIcon";
import AppRow from "../components/AppRow";
import AppButton from "../components/AppButton";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";

function EditProfilePage({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  let [fontsLoaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
  });

  // TextInput Theme
  const themes = {
    poppins: {
      fonts: {
        bodyLarge: {
          ...theme.fonts.bodyLarge,
          fontFamily: "Poppins_600SemiBold",
        },
      },
    },
  };

  let joinedDate = new Date(Number(route.params.userId.substring(18)));

  if (fontsLoaded) {
    return (
      <ScrollView style={{ width: width, height: height }}>
        <View style={[styles.container, { height: height + 50 }]}>
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
          <View>
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
            <AppRoundedIcon
              name={"edit"}
              iconType={"MaterialIcons"}
              backgroundColor={colors.primary}
              size={30}
              style={{
                position: "absolute",
                bottom: 2.5,
                right: 2.5,
              }}
            />
          </View>
          <View
            style={{
              alignItems: "center",
              width: width * 0.35,
            }}
          >
            <AppText
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20 / PixelRatio.getFontScale(),
                marginVertical: 13,
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
          <Formik
            initialValues={{
              email: route.params.email,
              username: route.params.name,
              profession: "",
              dob: "",
            }}
            onSubmit={async (values) => {
              let users;
              await AsyncStorage.getItem("@Users_Array", (err, result) => {
                if (err) return;
                else {
                  if (result === null) setUsers([]);
                  else users = JSON.parse(result).Users;
                }
              });

              // users.forEach(user => {
              //   if(user.userId === route.params.userId) {
              //     user.email = values.email
              //     user.
              //   }
              // });
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View
                style={{
                  width: width * 0.9,
                }}
              >
                <TextInputFormik
                  label={"Email Address"}
                  name={"email"}
                  onBlur={handleBlur}
                  onChangeText={handleChange}
                  value={values.email}
                  width={width}
                  theme={themes}
                  spacing={50}
                />
                <TextInputFormik
                  label={"Username"}
                  name={"username"}
                  onBlur={handleBlur}
                  onChangeText={handleChange}
                  value={values.username}
                  width={width}
                  theme={themes}
                  spacing={20}
                />
                <TextInputFormik
                  label={"Profession"}
                  name={"profession"}
                  onBlur={handleBlur}
                  onChangeText={handleChange}
                  value={values.profession}
                  width={width}
                  theme={themes}
                  spacing={20}
                />
                <DateInputFormik
                  label={"Birth Date (Optional)"}
                  name={"dob"}
                  onBlur={handleBlur}
                  onChangeText={handleChange}
                  value={values.dob}
                  width={width}
                  theme={themes}
                  spacing={20}
                  disabled={false}
                />
                <AppButton
                  title={"Submit"}
                  onPress={handleSubmit}
                  style={{
                    width: width * 0.3,
                    height: height * 0.05,
                    marginVertical: "30%",
                    alignSelf: "flex-end",
                  }}
                />
              </View>
            )}
          </Formik>

          <AppRow
            alignSelf="flex-start"
            justifyContent="flex-end"
            style={{ position: "absolute", bottom: 30, left: 30 }}
          >
            <AppText style={{ color: colors.grey }}>Joined </AppText>
            <AppText style={{ fontFamily: "Poppins_500Medium" }}>
              {joinedDate.toDateString().substring(4)}
            </AppText>
          </AppRow>
        </View>
      </ScrollView>
    );
  }
}

//Helpers
function DateInputFormik({
  label,
  name,
  onChangeText,
  onBlur,
  value,
  width,
  theme,
  spacing,
  disabled,
}) {
  const { setFieldValue } = useFormikContext();

  return (
    <View>
      <AppText
        style={[
          styles.menuTitle,
          {
            marginLeft: width * 0.04,
            marginTop: spacing,
          },
        ]}
      >
        {label}
      </AppText>
      <TextInput
        editable={disabled}
        onChangeText={onChangeText(name)}
        onBlur={onBlur(name)}
        value={value}
        underlineStyle={{
          width: width * 0.8,
          marginLeft: width * 0.04,
          marginBottom: 12,
        }}
        style={{
          backgroundColor: "transparent",
          marginTop: -10,
        }}
        theme={theme.poppins}
        right={
          <TextInput.Icon
            style={{ marginRight: 20 }}
            icon={"calendar"}
            onPress={() => {
              DateTimePickerAndroid.open({
                mode: "calender",
                onChange: (date) => {
                  console.log("Hello");
                  setFieldValue(
                    "dob",
                    new Date(date.nativeEvent.timestamp).toDateString()
                  );
                },
                value: new Date(),
              });
            }}
          />
        }
      />
    </View>
  );
}

function TextInputFormik({
  label,
  name,
  onChangeText,
  onBlur,
  value,
  width,
  theme,
  spacing,
  disabled,
}) {
  return (
    <View>
      <AppText
        style={[
          styles.menuTitle,
          {
            marginLeft: width * 0.04,
            marginTop: spacing,
          },
        ]}
      >
        {label}
      </AppText>
      <TextInput
        editable={disabled}
        onChangeText={onChangeText(name)}
        onBlur={onBlur(name)}
        value={value}
        underlineStyle={{
          width: width * 0.8,
          marginLeft: width * 0.04,
          marginBottom: 12,
        }}
        style={{
          backgroundColor: "transparent",
          marginTop: -10,
        }}
        theme={theme.poppins}
      />
    </View>
  );
}

//StyleSheet
const styles = StyleSheet.create({
  circleAvatar: {
    backgroundColor: colors.lightGray,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
  },
  menuTitle: {
    color: colors.grey,
    fontSize: 13 / PixelRatio.getFontScale(),
  },
  pageTitle: {
    fontSize: 18 / PixelRatio.getFontScale(),
    fontFamily: "Poppins_500Medium",
  },
});

export default EditProfilePage;
