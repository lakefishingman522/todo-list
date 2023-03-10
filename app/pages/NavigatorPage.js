import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
