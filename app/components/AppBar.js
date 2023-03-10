import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../config/colors";

export default function AppBar({
  barStyle,
  iconColor,
  name,
  children,
  size = 35,
}) {
  return (
    <View style={[styles.bar, barStyle]}>
      <AntDesign
        style={styles.icon}
        name={name}
        size={size}
        color={iconColor}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: "8%",
    width: "100%",
    backgroundColor: "red",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 15,
  },
});
