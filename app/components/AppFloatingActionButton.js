import React from "react";
import { Pressable, StyleSheet } from "react-native";

import AppRoundedIcon from "./AppRoundedIcon";

function AppFloatingActionButton({
  onPress,
  name,
  backgroundColor,
  iconColor,
  size,
  rippleConfig = {
    color: "white",
    foreground: true,
    radius: 30,
    borderless: true,
  },
  iconStyle,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.floatingIcon}
      android_ripple={rippleConfig}
    >
      <AppRoundedIcon
        style={iconStyle}
        name={name}
        backgroundColor={backgroundColor}
        iconColor={iconColor}
        size={size}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floatingIcon: {
    position: "absolute",
    bottom: 30,
    right: 30,
    elevation: 20,
  },
});

export default AppFloatingActionButton;
