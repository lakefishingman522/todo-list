import React, { useEffect, useState } from "react";
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
  const [myStyle, setMyStyle] = useState({});

  useEffect(() => {
    if (style === undefined) setMyStyle({ fontFamily: "Poppins_400Regular" });
    else {
      switch (style.fontWeight) {
        case "bold":
          console.log("Here");
          delete style.fontWeight;
          setMyStyle({ fontFamily: "Poppins_700Bold" });
          break;
        case "100":
          delete style.fontWeight;
          setMyStyle({ fontFamily: "Poppins_100Thin" });
          break;
        case "200":
          delete style.fontWeight;
          setMyStyle({ fontFamily: "Poppins_200ExtraLight" });
          break;
        case "300":
          delete style.fontWeight;
          setMyStyle({ fontFamily: "Poppins_300Light" });
          break;
        case "700":
          delete style.fontWeight;
          setMyStyle({ fontFamily: "Poppins_700Bold" });
          break;
        case "500":
          delete style.fontWeight;
          setMyStyle({ fontFamily: "Poppins_500Medium" });
          break;
        case "600":
          delete style.fontWeight;
          setMyStyle({ fontFamily: "Poppins_600SemiBold" });
          break;
        case "800":
          delete style.fontWeight;
          setMyStyle({ fontFamily: "Poppins_800ExtraBold" });
          break;
        case "900":
          delete style.fontWeight;
          setMyStyle({ fontFamily: "Poppins_900Black" });
          break;
        default:
          delete style.fontWeight;
          setMyStyle({ fontFamily: "Poppins_400Regular" });
          break;
      }
    }
  }, []);

  if (fontsLoaded) {
    return (
      <Text
        numberOfLines={numberOfLines}
        onPress={onPress}
        style={[style, myStyle]}
      >
        {children}
      </Text>
    );
  }
}
