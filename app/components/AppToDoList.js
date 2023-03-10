import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import colors from "../config/colors";

export default function AppToDoList({ data, onPressCheckBox, onPressCross }) {
  let textStyle = data.completed
    ? {
        textDecorationLine: "line-through",
      }
    : {};
  return (
    <View style={styles.container}>
      <BouncyCheckbox
        fillColor={colors.primary}
        onPress={onPressCheckBox}
        size={32}
        style={styles.button}
        isChecked={data.completed}
      />
      <Text style={[styles.text, textStyle]}>{data.title}</Text>
      <View>
        <Entypo
          onPress={onPressCross}
          style={styles.icon}
          name="cross"
          size={32}
          color={colors.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 20,
    paddingRight: 1,
    borderRightWidth: 1,
    backgroundColor: colors.lightGray,
  },
  container: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    margin: 20,
    justifyContent: "space-between",
    borderRadius: 10,
  },
  icon: {
    padding: 20,
    paddingLeft: 18,
    borderLeftWidth: 1,
    backgroundColor: colors.lightGray,
  },
  text: {
    width: "60%",
    paddingHorizontal: 4,
  },
});
