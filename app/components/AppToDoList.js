import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import colors from "../config/colors";
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

export default function AppToDoList({
  data,
  onPressCheckBox,
  onPressCross,
  onPressContent,
}) {
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
  let emote = "";

  switch (data.categories[0]) {
    case "Meeting":
      emote += "🤝\n";
      break;

    case "Review":
      emote += "📈\n";
      break;

    case "Marketing":
      emote += "🔊\n";
      break;

    case "Design Project":
      emote += "🎨\n";
      break;

    case "College":
      emote += "🎓\n";
      break;

    case "Movie":
      emote += "🍿\n";
      break;

    default:
      emote += "📝";
      break;
  }

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
  const [isAnimating, setIsAnimating] = useState(false);

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
          style={[styles.container, animatedStyle, animatedStyletoShowDetails]}
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
              <AppText style={styles.time}>{dueTimeString}</AppText>
            </AppRow>
            <AppRow justifyContent="space-between">
              <AppText style={styles.date}>{createDateString}</AppText>
              <AppText style={styles.date}>{"->"}</AppText>
              <AppText style={styles.date}>{dueDateString}</AppText>
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
            style={styles.arrow}
          >
            <MaterialIcons
              name={
                extraHeight > 0 ? "keyboard-arrow-down" : "keyboard-arrow-up"
              }
              size={24}
              color="black"
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
    left: "40%",
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
  date: {
    margin: 4,
    color: colors.grey,
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
    color: colors.grey,
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
