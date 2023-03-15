import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

import colors from "../config/colors";

export default function AppSBNB({ bgColor = colors.secondary, children }) {
  const { width, height } = useWindowDimensions();
  const translateY = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = event.translationY + context.startY;
    },
    onEnd: () => {
      let h = (height * 0.8) / 2;
      if (h <= translateY.value * -1) {
        translateY.value = withSpring(height * -0.675);
      } else translateY.value = withSpring(0);
    },
  });

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
          { backgroundColor: bgColor },
        ]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  bottomNavBar: {
    width: "100%",
    bottom: "-70%",
    height: "80%",
    borderRadius: 50,
    position: "absolute",
    alignItems: "center",
  },
});
