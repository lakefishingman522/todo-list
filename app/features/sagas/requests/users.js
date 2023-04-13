import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getUsers() {
  let data;
  await AsyncStorage.getItem("@Users_Array", (err, result) => {
    if (err) return err;
    else data = JSON.parse(result);
  });
  return data;
}

export async function setUsers(store) {
  let data = 400;
  if (JSON.stringify(store.user.currentUser) !== "{}") {
    console.log("Set Users");
    await AsyncStorage.setItem(
      `@Users_Array`,
      JSON.stringify(store.user.users),
      (err, result) => {
        if (err) return err;
        else data = 200;
      }
    );
  } else return 200;
  return data;
}

export async function deleteUserData(action) {
  let data = 400;
  await AsyncStorage.removeItem(`@todos_${action.payload.user.userId}`)
    .then((v) => {
      data = 200;
    })
    .catch((err) => {
      console.log(err);
    });

  return data;
}
