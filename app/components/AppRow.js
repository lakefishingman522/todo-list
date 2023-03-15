import React from "react";
import { View } from "react-native";

export default function AppRow({
  children,
  justifyContent = "flex-start",
  alignItems = "flex-start",
}) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: justifyContent,
          alignItems: alignItems,
        },
      ]}
    >
      {children}
    </View>
  );
}
