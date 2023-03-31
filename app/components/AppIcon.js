import React from "react";
import * as Icons from "@expo/vector-icons";

function AppIcon({
  iconType = "MaterialCommunityIcons",
  onPress,
  name,
  size = 24,
  color,
  style,
  disabled = false,
}) {
  let Icon = Icons[iconType];
  return (
    <Icon
      onPress={onPress}
      name={name}
      color={color}
      size={size}
      style={style}
      disabled={disabled}
    />
  );
}

export default AppIcon;
