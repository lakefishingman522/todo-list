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
  position,
}) {
  let posStyle;
  switch (position) {
    case "BottomLeft":
      posStyle = styles.floatingIconBottomLeft;
      break;
    case "TopLeft":
      posStyle = styles.floatingIconTopLeft;
      break;
    case "TopRight":
      posStyle = styles.floatingIconTopRight;
      break;

    default:
      posStyle = styles.floatingIconBottomRight;
      break;
  }

  return (
    <Pressable onPress={onPress} style={posStyle} android_ripple={rippleConfig}>
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
  floatingIconBottomRight: {
    position: "absolute",
    bottom: 30,
    right: 30,
    elevation: 20,
  },
  floatingIconTopRight: {
    position: "absolute",
    top: 30,
    right: 30,
    elevation: 20,
  },
  floatingIconTopLeft: {
    position: "absolute",
    bottom: 30,
    left: 30,
    elevation: 20,
  },
  floatingIconBottomLeft: {
    position: "absolute",
    bottom: 30,
    left: 30,
    elevation: 20,
  },
});

export default AppFloatingActionButton;
