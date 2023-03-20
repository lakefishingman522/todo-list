import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

export default function AppChip({ data }) {
  return (
    <View
      style={[
        styles.container,
        data.selected
          ? { borderWidth: 3, borderColor: colors.primary, elevation: 5 }
          : {},
      ]}
    >
      <AppText style={styles.title}>{data.title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    color: colors.black,
    fontFamily: "Poppins_400Regular",
  },
});
