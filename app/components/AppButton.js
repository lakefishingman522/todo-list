import React from "react";
import { View, StyleSheet, TouchableNativeFeedback } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function AppButton({ title, color = "primary", onPress, style }) {
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#fff", true)}
      onPress={onPress}
    >
      <View style={[styles.button, { backgroundColor: colors[color] }, style]}>
        <AppText
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: colors.white,
          }}
        >
          {title}
        </AppText>
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
});

export default AppButton;
