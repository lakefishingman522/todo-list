import React from "react";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { Text } from "react-native";
import { useSelector } from "react-redux";

export default function AppText({ style, children, onPress, numberOfLines }) {
  let [fontsLoaded, error] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  const themes = useSelector((state) => state.user.themes);
  const currentUser = useSelector((state) => state.user.currentUser);

  let color;
  if (JSON.stringify(currentUser) !== "{}" && currentUser.theme === "light") {
    color = themes.lightThemeColors.black;
  } else color = themes.darkThemeColors.text;

  if (fontsLoaded) {
    return (
      <Text
        numberOfLines={numberOfLines}
        onPress={onPress}
        style={[{ fontFamily: "Poppins_400Regular", color: color }, style]}
      >
        {children}
      </Text>
    );
  }
}
