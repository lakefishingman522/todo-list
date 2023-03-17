import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import colors from "../config/colors";
import AppRow from "./AppRow";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import {
  useFonts,
  Poppins_400Regular_Italic,
} from "@expo-google-fonts/poppins";

import AppText from "./AppText";

export default function AppToDoList({
  data,
  onPressCheckBox,
  onPressCross,
  onPressContent,
}) {
  let indicator = data.completed
    ? {
        backgroundColor: "green",
      }
    : { backgroundColor: "red" };

  let time = data.date.slice(16, 21);
  let date = data.date.slice(0, 15);
  let [fontsLoaded, error] = useFonts({
    Poppins_400Regular_Italic,
  });

  // Slide To Delete
  const translateX = useSharedValue(0);
  const panGestureEventToSlide = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      let newX = event.translationX + context.startX;
      if (newX < 0 && newX * -1 < 70) translateX.value = newX;
    },
    onEnd: (event) => {
      if (event.translationX * -1 < 50) translateX.value = withSpring(0);
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  // More Details
  const [extraHeight, setterExtraHeight] = useState(60);
  const height = useSharedValue(140);
  const animatedStyletoShowDetails = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });
  if (fontsLoaded)
    return (
      <View>
        <MaterialCommunityIcons
          onPress={onPressCross}
          style={styles.icon}
          name="delete"
          color="red"
          size={35}
        />
        <PanGestureHandler
          onGestureEvent={panGestureEventToSlide}
          activateAfterLongPress={80}
        >
          <Animated.View
            style={[
              styles.container,
              animatedStyle,
              animatedStyletoShowDetails,
            ]}
          >
            <View style={[styles.indicator, indicator]} />
            <View>
              <AppRow justifyContent="space-between">
                <AppText
                  numberOfLines={extraHeight > 0 ? 2 : 3}
                  onPress={onPressContent}
                  style={{
                    width: "80%",
                    padding: 4,
                    fontSize: 16,
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {data.title}
                </AppText>
                <AppText
                  style={{
                    margin: 4,
                    color: colors.grey,
                    fontWeight: "400",
                    fontSize: 12.5,
                  }}
                >
                  {time}
                </AppText>
              </AppRow>
              <AppText
                style={{
                  margin: 4,
                  color: colors.grey,
                  fontWeight: "400",
                  paddingTop: 8,
                }}
              >
                {date}
              </AppText>
              {extraHeight < 0 ? (
                <AppRow style={styles.button} alignItems="center">
                  <BouncyCheckbox
                    fillColor={colors.primary}
                    onPress={onPressCheckBox}
                    size={24}
                    isChecked={data.completed}
                  />
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular_Italic",
                    }}
                  >
                    {data.completed ? "Completed" : "Pending"}
                  </Text>
                </AppRow>
              ) : null}
            </View>
            <View style={styles.arrow}>
              <MaterialIcons
                name={
                  extraHeight > 0 ? "keyboard-arrow-down" : "keyboard-arrow-up"
                }
                size={24}
                color="black"
                onPress={() => {
                  height.value = withTiming(height.value + extraHeight, {
                    duration: 400,
                  });
                  setterExtraHeight(extraHeight * -1);
                }}
              />
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
}

const styles = StyleSheet.create({
  arrow: {
    width: 100,
    height: 20,
    position: "absolute",
    bottom: 5,
    left: "52%",
  },
  button: {
    position: "absolute",
    bottom: 30,
  },
  container: {
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
    justifyContent: "space-between",
    marginVertical: 16,
    marginHorizontal: 24,
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 10,
    shadowColor: colors.lightGray,
    flexDirection: "row",
  },
  icon: { position: "absolute", right: 40, top: "40%" },
  indicator: {
    marginVertical: 8,
    marginRight: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
