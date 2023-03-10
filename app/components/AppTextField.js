import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";

function AppTextField({
  iconName,
  setValue,
  placeholder,
  value,
  style,
  type = "text",
}) {
  const [backgroundcolor, setBG] = useState(colors.lightGray);
  const elevation = backgroundcolor === colors.lightGray ? 0 : 10;

  // const [emailText, setEmailText] = useState("");

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
      <FontAwesome name={iconName} color={colors.black} size={24} />
      <TextInput
        secureTextEntry={type === "password" ? true : false}
        style={{
          marginLeft: 20,
          flex: 1,
          fontWeight: "bold",
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
