import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";

import LoginPage from "./LoginPage";
import HomePage from "./HomePage";

const Stack = createNativeStackNavigator();

export default function NavigatorPage() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{
            headerShown: false,
            animation: "flip",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
