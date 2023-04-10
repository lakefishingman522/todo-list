import React from "react";
import { Pressable, View } from "react-native";
import AppText from "./AppText";

function AppAnalog({
  hour,
  minutes,
  seconds,
  size,
  showSeconds,
  style,
  onPress,
}) {
  let text = "AM";
  if (hour > 12) text = "PM";
  hour = hour > 12 ? hour - 12 : hour;
  minutes = minutes / 5;
  seconds = seconds > 60 ? seconds - 60 : seconds;
  var lanHour = size / 6;
  var lanMinutes = size / 3.75;
  var lanSeconds = size / 3.75;
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          {
            backgroundColor: "white",
            borderRadius: size / 2,
            justifyContent: "center",
            alignItems: "center",
            height: size,
            width: size,
            elevation: 5,
          },
          style,
        ]}
      >
        {[...Array(12).keys()].map((i, index) => {
          let a = -60 + 30 * i;
          let b = 60 - 30 * i;
          return (
            <View
              key={index}
              style={{
                position: "absolute",
                transform: [
                  { rotate: a + "deg" },
                  { translateX: size / 2 - 25 },
                ],
              }}
            >
              <AppText
                style={{
                  fontSize: size / 13,
                  transform: [{ rotate: b + "deg" }],
                }}
              >
                {i + 1}
              </AppText>
            </View>
          );
        })}
        <AppText
          style={[
            {
              position: "absolute",
              fontFamily: "Poppins_500Medium",
            },
            hour > 9 || hour < 3 ? { top: "60%" } : { top: "30%" },
          ]}
        >
          {text}
        </AppText>
        <View
          style={{
            zIndex: 1,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "black",
          }}
        />
        <View
          style={{
            position: "absolute",
            width: lanHour,
            height: 4,
            borderRadius: 4,
            backgroundColor: "black",
            transform: [
              { rotate: -90 + (hour + minutes / 12) * 30 + "deg" },
              { translateX: lanHour / 2 },
            ],
          }}
        />
        <View
          style={{
            position: "absolute",
            width: lanMinutes,
            height: 4,
            borderRadius: 4,
            backgroundColor: "black",
            transform: [
              { rotate: -90 + minutes * 30 + "deg" },
              { translateX: lanMinutes / 2 },
            ],
          }}
        />
        {showSeconds && (
          <View
            style={{
              position: "absolute",
              width: lanSeconds,
              height: 2,
              borderRadius: 4,
              backgroundColor: "black",
              transform: [
                { rotate: -90 + seconds * 6 + "deg" },
                { translateX: lanSeconds / 2 },
              ],
            }}
          />
        )}
      </View>
    </Pressable>
  );
}

export default AppAnalog;
