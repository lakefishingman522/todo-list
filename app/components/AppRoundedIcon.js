import React from "react";
import { View } from "react-native";
import AppIcon from "./AppIcon";

function AppRoundedIcon({
  name,
  size = 24,
  backgroundColor = "black",
  iconColor = "white",
  style,
  iconType = "AntDesign",
  onPress,
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <AppIcon
        iconType={iconType}
        onPress={onPress}
        name={name}
        size={size * 0.5}
        color={iconColor}
      />
    </View>
  );
}

export default AppRoundedIcon;
