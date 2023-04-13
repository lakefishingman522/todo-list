import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

import colors from "../config/colors";

export default function AppSBNB({
  bgColor = colors.secondary,
  children,
  translateY,
  panGestureEvent,
}) {
  const { width, height } = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View
        style={[
          styles.bottomNavBar,
          animatedStyle,
          {
            backgroundColor: bgColor,
            top: height * 0.95,
            width: width,
            height: height * 0.8,
            borderTopWidth: 0.2,
            borderStartWidth: 0.5,
            borderEndWidth: 0.5,
            borderColor: "white",
          },
        ]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  bottomNavBar: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: "absolute",
    alignItems: "center",
  },
});
