import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableNativeFeedback,
} from "react-native";
import colors from "../config/colors";

function AppButton({ title, color = "primary", onPress, style }) {
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#fff", true)}
      onPress={onPress}
    >
      <View style={[styles.button, { backgroundColor: colors[color] }, style]}>
        <Text style={styles.buttonTitle}> {title} </Text>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    width: "100%",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.white,
  },
});

export default AppButton;
