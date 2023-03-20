import React from "react";
import { View } from "react-native";
import colors from "../config/colors";

export default function AppLine({ horizontal = false }) {
  return !horizontal ? (
    <View
      style={{
        borderWidth: 0.3,
        width: "100%",
        borderColor: "rgba(255, 255, 255, 0.5)",
        marginVertical: 20,
        backgroundColor: colors.white,
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
