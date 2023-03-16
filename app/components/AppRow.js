import React from "react";
import { View } from "react-native";

export default function AppRow({
  children,
  justifyContent = "flex-start",
  alignItems = "flex-start",
  alignSelf = "",
  style,
}) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: justifyContent,
          alignItems: alignItems,
        },

        alignSelf !== "" ? { alignSelf: alignSelf } : {},
        style,
      ]}
    >
      {children}
    </View>
  );
}
