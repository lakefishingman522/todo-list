import React, { forwardRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";

import colors from "../config/colors";

const AppTextField = forwardRef(
  (
    {
      iconName,
      setValue,
      placeholder,
      value,
      style,
      type = "text",
      onPressIcon,
    },
    ref
  ) => {
    const [backgroundcolor, setBG] = useState(colors.lightGray);
    const elevation = backgroundcolor === colors.lightGray ? 0 : 10;
    let [fontsLoaded, error] = useFonts({
      Poppins_700Bold,
    });
    if (fontsLoaded)
      return (
        <View
          style={[
            styles.container,
            {
              backgroundColor: backgroundcolor,
              elevation: elevation,
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
            ref={ref}
            secureTextEntry={type === "password" ? true : false}
            style={styles.input}
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
);
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    borderRadius: 5,
  },
  input: {
    marginLeft: 20,
    flex: 1,
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
});

export default AppTextField;
