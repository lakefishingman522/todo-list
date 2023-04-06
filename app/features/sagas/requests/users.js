import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getUsers() {
  let data;
  await AsyncStorage.getItem("@Users_Array", (err, result) => {
    if (err) return err;
    else data = JSON.parse(result);
  });
  return data;
}
