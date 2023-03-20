import React from "react";
import { View } from "react-native";

export default function AppSizedBox({
  width = 0,
  height = 0,
  backgroundColor,
  children,
}) {
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColor,
      }}
    >
      {children}
    </View>
  );
}
