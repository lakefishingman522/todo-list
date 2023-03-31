import React from "react";
import { PixelRatio, useWindowDimensions } from "react-native";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

export default function AppChip({ data, style }) {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={[
        styles.container,
        data.selected
          ? {
              elevation: 10,
              backgroundColor: "rgba(255,255,255,1)",
            }
          : {},
        {
          width: width * 0.3,
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
          { color: data.selected ? colors.black : colors.grey },
        ]}
      >
        {data.title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.8)",
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
