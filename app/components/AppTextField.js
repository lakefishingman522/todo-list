import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";

import colors from "../config/colors";

function AppTextField({
  iconName,
  setValue,
  placeholder,
  value,
  style,
  type = "text",
  onPressIcon,
}) {
  const [backgroundcolor, setBG] = useState(colors.lightGray);
  const elevation = backgroundcolor === colors.lightGray ? 0 : 10;
  let [fontsLoaded, error] = useFonts({
    Poppins_700Bold,
  });
  if (fontsLoaded)
    return (
      <View
        style={[
          {
            paddingHorizontal: 20,
            paddingVertical: 18,
            flexDirection: "row",
            backgroundColor: backgroundcolor,
            elevation: elevation,
            borderRadius: 5,
          },
          style,
        ]}
      >
        <FontAwesome
          onPress={onPressIcon}
          name={iconName}
          color={colors.black}
          size={24}
        />
        <TextInput
          secureTextEntry={type === "password" ? true : false}
          style={{
            marginLeft: 20,
            flex: 1,
            fontFamily: "Poppins_700Bold",
            fontSize: 16,
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.grey}
          onFocus={() => {
            setBG("#f0dddd");
          }}
          onEndEditing={() => {
            setBG(colors.lightGray);
          }}
          onChangeText={setValue}
          value={value}
        />
      </View>
    );
}

export default AppTextField;
