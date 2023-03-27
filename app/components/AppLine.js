import React from "react";
import { View } from "react-native";
import colors from "../config/colors";

export default function AppLine({
  horizontal = false,
  color = colors.white,
  borderWidth = 0.3,
  borderColor = "rgba(255, 255, 255, 0.5)",
  marginVertical = 15,
}) {
  return (
    <View
      style={[
        {
          borderWidth: borderWidth,
          borderColor: borderColor,
          marginVertical: marginVertical,
          backgroundColor: color,
        },
        !horizontal ? { width: "100%" } : { height: "100%" },
      ]}
    />
  );
}
