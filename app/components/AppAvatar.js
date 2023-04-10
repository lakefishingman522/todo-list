import { Image, Pressable, View } from "react-native";
import AppIcon from "./AppIcon";
import React from "react";
import colors from "../config/colors";

function AppAvatar({
  profileImage,
  size,
  onPress,
  iconColor,
  backgroundColor = colors.lightGray,
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: backgroundColor,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        {!profileImage ? (
          <AppIcon
            iconType="AntDesign"
            name="user"
            size={size / 2}
            color={iconColor}
          />
        ) : (
          <Image
            source={{ uri: profileImage }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
          />
        )}
      </View>
    </Pressable>
  );
}

export default AppAvatar;
