import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../config/colors";

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
      <Text>{data.title}</Text>
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
  text: { fontSize: 14, color: colors.black },
});
