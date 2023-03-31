import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import AppIcon from "./AppIcon";

export default function AppBar({
  barStyle,
  iconColor,
  iconType = "AntDesign",
  name,
  children,
  onPressIcon,
  size = 35,
}) {
  const height = useWindowDimensions().height;
  return (
    <View style={[styles.bar, barStyle, { height: height * 0.08 }]}>
      <AppIcon
        iconType={iconType}
        style={styles.icon}
        name={name}
        size={size}
        color={iconColor}
        onPress={onPressIcon}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "red",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 15,
  },
});
