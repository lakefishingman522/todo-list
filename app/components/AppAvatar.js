import { Image, View } from "react-native";
import AppIcon from "./AppIcon";
import React from "react";
import colors from "../config/colors";

function AppAvatar({ profileImage, size }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.lightGray,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      {!profileImage ? (
        <AppIcon iconType="AntDesign" name="user" size={size / 2} />
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
  );
}

export default AppAvatar;
