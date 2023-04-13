import React from "react";
import { PixelRatio, useWindowDimensions } from "react-native";
import { StyleSheet, View } from "react-native";

import AppText from "./AppText";

export default function AppChip({ data, style, colors }) {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={[
        styles.container,
        data.selected
          ? {
              elevation: 10,
              backgroundColor: "rgba(255,255,255,1)",
              shadowColor: colors.grey,
            }
          : {
              backgroundColor: colors.nearWhite,
            },
        {
          width: width * 0.32,
          height: height * 0.06,
          borderRadius: height * 0.03,
        },
        style,
      ]}
    >
      <AppText
        numberOfLines={1}
        style={[
          styles.title,
          { color: !data.selected ? colors.grey : colors.black },
        ]}
      >
        {data.title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "rgba(255,255,255,0.8)",
    paddingVertical: 13,
    paddingHorizontal: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14 / PixelRatio.getFontScale(),
    fontFamily: "Poppins_400Regular",
  },
});
