// Default or Third Party Library Imports
import React, { useState } from "react";
import {
  PixelRatio,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
  ScrollView,
  Image,
} from "react-native";
import { HelperText, TextInput, useTheme } from "react-native-paper";
import { Formik, useFormikContext } from "formik";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
} from "@expo-google-fonts/poppins";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Yup from "yup";

// Custom Imports
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppBar from "../components/AppBar";
import AppRoundedIcon from "../components/AppRoundedIcon";
import AppRow from "../components/AppRow";
import AppButton from "../components/AppButton";
import { setCurrentUser, setUser } from "../features/actions";
import AppIcon from "../components/AppIcon";

function EditProfilePage({ navigation, route }) {
  //Dispatcher
  const dispatcher = useDispatch();

  //Selectors
  const { users, currentUser } = useSelector((state) => state.user);

  //Utils
  const { width, height } = useWindowDimensions();
  let joinedDate = new Date(
    Number(currentUser.userId.slice(currentUser.userId.indexOf("-") + 1))
  );
  const [image, setImage] = useState(currentUser.profileImage);

  //Fonts Hook
  let [fontsLoaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
  });

  // TextInput Theme
  const theme = useTheme();
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

  //Yup Validater
  const userDetailsSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Too Short!")
      .max(25, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Email address is invalid!").required("Required"),
    dob: Yup.string(),
    place: Yup.string().required("Required"),
  });

  if (fontsLoaded) {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={[styles.container]}>
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
            >
              {image === "" ? (
                <AppIcon
                  iconType="AntDesign"
                  name="user"
                  size={(height * 0.14) / 2}
                />
              ) : (
                <Image
                  source={{ uri: image }}
                  style={{
                    width: height * 0.14,
                    height: height * 0.14,
                    borderRadius: (height * 0.14) / 2,
                  }}
                />
              )}
            </View>
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
              onPress={async () => {
                try {
                  let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                  });

                  if (!result.canceled) setImage(result.assets[0].uri);
                } catch (err) {
                  console.log(err);
                }
              }}
            />
          </View>
          <View
            style={{
              alignItems: "center",
              width: width * 0.35,
              marginTop: 15,
            }}
          >
            {image ? (
              <AppText
                style={{
                  marginBottom: 10,
                  color: "red",
                  fontFamily: "Poppins_600SemiBold",
                }}
                onPress={() => setImage("")}
              >
                Delete Profile
              </AppText>
            ) : null}
            <AppText
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20 / PixelRatio.getFontScale(),
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
          <Formik
            initialValues={{
              email: currentUser.email,
              username: currentUser.name,
              place: currentUser.place ? currentUser.place : "",
              dob: currentUser.dob ? currentUser.dob : "",
            }}
            validationSchema={userDetailsSchema}
            onSubmit={async (values) => {
              currentUser.email = values.email.trim();
              currentUser.name = values.username.trim();
              currentUser.place = values.place.trim();
              if (values.dob) currentUser.dob = values.dob.trim();
              if (image) currentUser.profileImage = image;

              users[currentUser.userId] = currentUser;
              await AsyncStorage.setItem("@Users_Array", JSON.stringify(users))
                .then((v) => {
                  dispatcher(setUser({ users: users }));
                  dispatcher(setCurrentUser({ user: currentUser }));

                  navigation.goBack();
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
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
                {errors.email && touched.email ? (
                  <HelperText type="error" visible={errors.email}>
                    {errors.email}
                  </HelperText>
                ) : null}
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
                {errors.username && touched.username ? (
                  <HelperText type="error" visible={errors.username}>
                    {errors.username}
                  </HelperText>
                ) : null}
                <TextInputFormik
                  label={"Place"}
                  name={"place"}
                  onBlur={handleBlur}
                  onChangeText={handleChange}
                  value={values.place}
                  width={width}
                  theme={themes}
                  spacing={20}
                />
                {errors.place && touched.place ? (
                  <HelperText type="error" visible={errors.place}>
                    {errors.place}
                  </HelperText>
                ) : null}
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
                {errors.dob && touched.dob ? (
                  <HelperText type="error" visible={errors.dob}>
                    {errors.dob}
                  </HelperText>
                ) : null}
                <AppButton
                  title={"Save"}
                  onPress={handleSubmit}
                  style={{
                    width: width * 0.3,
                    height: height * 0.05,
                    marginTop: "30%",
                    marginBottom: "5%",
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
  const [showPicker, setShowPicker] = useState(false);

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
          value === "" ? (
            <TextInput.Icon
              style={{ marginRight: 20 }}
              icon={"calendar"}
              onPress={() => setShowPicker(true)}
            />
          ) : (
            <TextInput.Icon
              style={{ marginRight: 20 }}
              icon={"close"}
              onPress={() => {
                setFieldValue("dob", "");
              }}
            />
          )
        }
      />
      <DateTimePickerModal
        isVisible={showPicker}
        mode="date"
        onConfirm={(date) => {
          let today = new Date(Date.now()).toISOString().slice(0, 10);
          let selectedDate = date.toISOString().slice(0, 10);
          if (today !== selectedDate) setFieldValue("dob", date.toDateString());
          setShowPicker(false);
        }}
        onCancel={() => setShowPicker(false)}
        value={new Date()}
        maximumDate={new Date()}
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
    justifyContent: "center",
    alignItems: "center",
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
