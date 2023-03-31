// Default or Third Party Library Imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Custom Imports
import LoginPage from "./app/pages/LoginPage";
import HomePage from "./app/pages/HomePage";
import AgendaPage from "./app/pages/AgendaPage";
import ProfilePage from "./app/pages/ProfilePage";
import EditProfilePage from "./app/pages/EditProfilePage";

//Creating Navigation Stack
const { Navigator, Screen } = createNativeStackNavigator();

export default function NavigatorPage() {
  return (
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
  );
}
