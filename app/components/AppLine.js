import React from "react";
import { View } from "react-native";
import colors from "../config/colors";

export default function AppLine({
  horizontal = false,
  color = colors.white,
  borderWidth = 0.3,
  borderColor = "rgba(255, 255, 255, 0.5)",
  marginVertical = 20,
}) {
  return !horizontal ? (
    <View
      style={{
        borderWidth: borderWidth,
        width: "100%",
        borderColor: borderColor,
        marginVertical: marginVertical,
        backgroundColor: color,
      }}
    />
  ) : (
    <View
      style={{
        borderWidth: 0.3,
        height: "100%",
        borderColor: "rgba(255, 255, 255, 0.5)",
        marginVertical: 20,
      }}
    />
  );
}
