import React from "react";
import { View, StyleSheet, Text, useWindowDimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../config/colors";

export default function AppBar({
  barStyle,
  iconColor,
  name,
  children,
  size = 35,
}) {
  const height = useWindowDimensions().height;
  return (
    <View style={[styles.bar, barStyle, { height: height * 0.08 }]}>
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
    width: "100%",
    backgroundColor: "red",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 15,
  },
});
