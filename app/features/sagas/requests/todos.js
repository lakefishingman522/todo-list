import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";

export async function persistTodo(store) {
  let result = await AsyncStorage.setItem(
    `@todos_${store.user.currentUser.userId}`,
    JSON.stringify(store.todo)
  )
    .then((value) => {
      console.log("DB Setted");
      return 200;
    })
    .catch((err) => {
      ToastAndroid.show("Unable to Connect... Try Again", ToastAndroid.SHORT);
      console.log("Error");
      return 400;
    });

  return result;
}

export async function persistTodoCategories(store) {
  let result = await AsyncStorage.setItem(
    `@todosCategories_${store.user.currentUser.userId}`,
    JSON.stringify(store.categories.objects)
  )
    .then((value) => {
      console.log("DB Setted");
      return 200;
    })
    .catch((err) => {
      ToastAndroid.show("Unable to Connect... Try Again", ToastAndroid.SHORT);
      console.log("Error");
      return 400;
    });

  return result;
}

export async function getTodos(userId) {
  let data;
  try {
    const jsonValue = await AsyncStorage.getItem(`@todos_${userId}`);
    data = JSON.parse(jsonValue);
  } catch (error) {
    console.log(error);
  }
  return data;
}

export async function getTodosCategory(userId) {
  let data;
  try {
    const jsonValue = await AsyncStorage.getItem(`@todosCategories_${userId}`);
    data = JSON.parse(jsonValue);
  } catch (error) {
    console.log(error);
  }
  return data;
}
