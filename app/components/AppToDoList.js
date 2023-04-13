import React, { useState } from "react";
import { View, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AppRow from "./AppRow";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

import AppText from "./AppText";
import AppIcon from "./AppIcon";

export default function AppToDoList({
  data,
  onPressCheckBox,
  onPressCross,
  colors,
  onPressContent,
}) {
  const { width: vw, height: vh } = useWindowDimensions();

  //Calculating Details
  let indicator = data.completed
    ? {
        backgroundColor: "green",
      }
    : { backgroundColor: "red" };

  let createdDate = new Date(data.createdDate);
  let dueDate = new Date(data.dueDate);

  let dueDateString = dueDate.toISOString().slice(0, 10);
  let createDateString = createdDate.toISOString().slice(0, 10);

  let dueTimeString = dueDate.toString().slice(16, 21);
  let emote = "📝";

  const withEmojis = /\p{Extended_Pictographic}/u;

  if (withEmojis.test(data.categories[0].slice(0, 2)))
    emote = data.categories[0].slice(0, 2);

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
      width: vw * 0.85,
    };
  });
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <View>
      <AppIcon
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
            {
              backgroundColor: colors.card,
              shadowColor: colors.lightGray,
            },
            animatedStyle,
            animatedStyletoShowDetails,
          ]}
        >
          <View style={{ alignItems: "center" }}>
            <View style={[styles.indicator, indicator]} />
            <AppText style={{ marginVertical: 8, fontSize: 18 }}>
              {emote}
            </AppText>
          </View>

          <View>
            <AppRow justifyContent="space-between">
              <AppText
                numberOfLines={extraHeight > 0 ? 2 : 3}
                onPress={onPressContent}
                style={styles.title}
              >
                {data.title}
              </AppText>
              <AppText style={[styles.time, { color: colors.grey }]}>
                {dueTimeString}
              </AppText>
            </AppRow>
            <AppRow justifyContent="space-between">
              <AppText style={[styles.date, { color: colors.grey }]}>
                {createDateString}
              </AppText>
              <AppText style={[styles.date, { color: colors.grey }]}>
                {"->"}
              </AppText>
              <AppText style={[styles.date, { color: colors.grey }]}>
                {dueDateString}
              </AppText>
            </AppRow>
            {extraHeight < 0 ? (
              <AppRow style={styles.button} alignItems="center">
                <BouncyCheckbox
                  fillColor={colors.primary}
                  onPress={onPressCheckBox}
                  size={24}
                  isChecked={data.completed}
                />
                <AppText style={styles.check}>
                  {data.completed ? "Completed" : "Pending"}
                </AppText>
              </AppRow>
            ) : null}
          </View>
          <Pressable
            disabled={isAnimating}
            onPress={() => {
              setIsAnimating(true);
              height.value = withTiming(
                height.value + extraHeight,
                {
                  duration: 400,
                },
                ({ finished }) => {
                  runOnJS(setIsAnimating)(false);
                }
              );
              setterExtraHeight(extraHeight * -1);
            }}
            style={[styles.arrow, { left: vw * 0.275 }]}
          >
            <AppIcon
              iconType="MaterialIcons"
              name={
                extraHeight > 0 ? "keyboard-arrow-down" : "keyboard-arrow-up"
              }
              size={24}
              color={colors.text}
            />
          </Pressable>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  arrow: {
    width: 100,
    height: 40,
    position: "absolute",
    bottom: 5,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    position: "absolute",
    bottom: 30,
  },
  check: {
    fontFamily: "Poppins_400Regular_Italic",
  },
  container: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingTop: 15,
    justifyContent: "space-around",
    marginVertical: 16,
    marginHorizontal: 30,
    borderRadius: 10,
    elevation: 10,
    flexDirection: "row",
  },
  date: {
    margin: 4,
    paddingTop: 8,
  },
  icon: { position: "absolute", right: 40, top: "40%" },
  indicator: {
    marginVertical: 8,
    marginRight: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  time: {
    margin: 4,
    fontSize: 12.5,
  },
  title: {
    width: "80%",
    padding: 4,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    textTransform: "capitalize",
  },
});
