import React from "react";
import { View, StyleSheet, TouchableNativeFeedback } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function AppButton({ title, color = "primary", onPress, style }) {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={[styles.button, { backgroundColor: colors[color] }, style]}>
        <AppText style={styles.title}>{title}</AppText>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontFamily: "Poppins_700Bold",
    color: colors.white,
  },
});

export default AppButton;
