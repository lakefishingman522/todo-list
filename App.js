// Default or Third Party Library Imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";

// Custom Imports
import LoginPage from "./app/pages/LoginPage";
import HomePage from "./app/pages/HomePage";
import AgendaPage from "./app/pages/AgendaPage";
import ProfilePage from "./app/pages/ProfilePage";
import EditProfilePage from "./app/pages/EditProfilePage";
import store from "./app/features/store";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { RESET, persister } from "./app/features/actions";
import { initialStateTodo } from "./app/features/reducers/todos";
import { initialStateCategory } from "./app/features/reducers/todoscategories";

//Creating Navigation Stack
const { Navigator, Screen } = createNativeStackNavigator();

//Utils
let isLoginPage = true;

export default function NavigatorPage() {
  //Appstate reference
  const appState = useRef(AppState.currentState);

  //Listener for App Activeness
  useEffect(() => {
    const subscribe = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;

      if (!isLoginPage && appState.current === "background") {
        console.log("AppState", appState.current);
        store.dispatch(persister(store.getState()));
      }
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
            listeners={({}) => ({
              blur: () => {
                isLoginPage = false;
              },
              focus: () => {
                isLoginPage = true;
                store.dispatch({ type: RESET, payload: store.getState() });
              },
            })}
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
