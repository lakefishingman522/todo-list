// Default or Third Party Library Imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch } from "react-redux";

// Custom Imports
import LoginPage from "./app/pages/LoginPage";
import HomePage from "./app/pages/HomePage";
import AgendaPage from "./app/pages/AgendaPage";
import ProfilePage from "./app/pages/ProfilePage";
import EditProfilePage from "./app/pages/EditProfilePage";
import store from "./app/features/store";
import { useEffect } from "react";
import { AppState } from "react-native";

//Creating Navigation Stack
const { Navigator, Screen } = createNativeStackNavigator();

export default function NavigatorPage() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscribe = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscribe.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator initialRouteName="Login">
          <Screen
            name="LoginPage"
            component={LoginPage}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="HomePage"
            component={HomePage}
            options={{
              headerShown: false,
              animation: "flip",
            }}
          />
          <Screen
            name="AgendaPage"
            component={AgendaPage}
            options={{
              headerShown: false,
              animation: "flip",
            }}
          />
          <Screen
            name="ProfilePage"
            component={ProfilePage}
            options={{
              headerShown: false,
              animation: "flip",
            }}
          />
          <Screen
            name="EditProfilePage"
            component={EditProfilePage}
            options={{
              headerShown: false,
              animation: "flip",
            }}
          />
        </Navigator>
      </NavigationContainer>
    </Provider>
  );
}
