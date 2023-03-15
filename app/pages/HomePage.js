// Default or Third Party Library Imports
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  TextInput,
  FlatList,
  Modal,
  Text,
  Keyboard,
  useWindowDimensions,
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Custom Imports
import colors from "../config/colors";
import axios from "axios";
import AppToDoList from "../components/AppToDoList";
import AppBar from "../components/AppBar";
import AppFloatingActionButton from "../components/AppFloatingActionButton";
import AppIcon from "../components/AppIcon";
import AppButton from "../components/AppButton";
import search from "../config/search";
import AppSliderBottomNavBar from "../components/AppSliderBottomNavBar";
import AppRow from "../components/AppRow";

//Custom Hook
function useTodos(todos) {
  let total = 0,
    completed = 0,
    pending = 0;

  todos.filter((todo) => {
    total++;

    if (todo.completed) completed++;
    else pending++;
  });

  return [total, completed, pending];
}

export default function HomePage({ route, navigation }) {
  //States
  const { height, width } = useWindowDimensions();
  const [taskInputController, settaskInputController] = useState("");
  const [taskSearch, settaskSearch] = useState("");
  const [todos, setTodos] = useState([]);
  const [todosForSearch, setTodosForSearch] = useState([]);
  let [total, completed, pending] = useTodos(todos);
  const [fetching, setFetching] = useState(true);
  const [searching, setSearching] = useState(true);
  const [toDoModalVisible, setToDoModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [todoObject, setTodoObject] = useState({});
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const isSearchOnFocus = useRef();
  const isAddOnFocus = useRef();

  //Get Todos
  useEffect(() => {
    async function getTodos() {
      const userId = route.params.id;
      const response = await axios(
        `https://jsonplaceholder.typicode.com/todos`
      );

      let newTodos = response.data.filter((todo) => {
        if (todo.userId === userId) {
          let y = Math.random() * (1 - 0.996) + 0.996;
          todo.date = new Date(Date.now() * y).toString().slice(0, 24);
          return todo;
        }
      });
      setTodos(newTodos);
      setTodosForSearch(newTodos);
      [total, completed, pending] = useTodos(todos);
      setFetching(false);
    }

    getTodos();
  }, []);

  //Event Listener for KeyBoard
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(1);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // useEffect(() => {
  //   if (!keyboardStatus) {
  //     if (!searching) isAddOnFocus.current.blur();
  //     else isSearchOnFocus.current.blur();
  //   }
  // }, [keyboardStatus]);

  useEffect(() => {
    if (!searching) {
      isAddOnFocus.current.focus();
    }
  }, [searching]);

  //Handlers
  onPressProfileIcon = () => {
    [total, completed, pending] = useTodos(todos);
    setProfileModalVisible(true);
  };

  addTodo = () => {
    Keyboard.dismiss();
    if (taskInputController.trim() === "") return;
    let newTodos = [
      {
        userId: 1,
        id: todos.length + 1,
        title: taskInputController.trim(),
        completed: false,
        date: new Date().toString().slice(0, 24),
      },
      ...todos,
    ];
    settaskInputController("");
    setTodos(newTodos);
    setTodosForSearch(newTodos);
    setSearching(!searching);
  };

  closeDetailedView = () => setToDoModalVisible(false);

  closeProfileView = () => setProfileModalVisible(false);

  showDetailedView = (item) => {
    setToDoModalVisible(true);
    setTodoObject(item);
  };

  deletetodo = (item) => {
    let newTodos = todos.filter((todo) => {
      if (todo.id != item.id) return todo;
    });

    setTodos(newTodos);
  };

  markCompletedOnToDo = (item) => {
    let newTodos = todos.filter((todo) => {
      if (todo.id == item.id) todo.completed = !todo.completed;

      return todo;
    });

    setTodos(newTodos);
  };

  toggleFAB = () => {
    setSearching(!searching);
  };

  modelReqClose = () => {
    Alert.alert("Modal has been closed.");
    setToDoModalVisible(!toDoModalVisible);
  };

  profileModelReqClose = () => {
    Alert.alert("Modal has been closed.");
    setToDoModalVisible(!profileModalVisible);
  };

  searchTodo = (newText) => {
    settaskSearch(newText);
    setTodos(search(todosForSearch, newText));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.toDoContainer}>
        <AppBar
          size={30}
          name={searching ? "search1" : "plus"}
          iconColor="white"
          barStyle={[
            styles.appBarStyle,
            keyboardStatus ? { height: "11.8%" } : {},
          ]}
        >
          {searching ? (
            <View style={styles.viewHeader}>
              <TextInput
                style={styles.searchBar}
                onChangeText={(newText) => searchTodo(newText)}
                value={taskSearch}
                placeholder={"Search..."}
                placeholderTextColor={"#FFFFF0"}
              />
              {keyboardStatus ? (
                <AntDesign name="close" color={colors.white} size={20} />
              ) : (
                <View style={{ width: 20 }} />
              )}
              <AppIcon
                name="user"
                size={50}
                iconColor={colors.primary}
                backgroundColor={colors.white}
                onPress={onPressProfileIcon}
              />
            </View>
          ) : (
            <View style={styles.viewHeader}>
              <TextInput
                ref={isAddOnFocus}
                multiline={true}
                style={styles.addBar}
                onChangeText={settaskInputController}
                value={taskInputController}
                placeholder={"What do you want to do?"}
                placeholderTextColor={"#FAF9F6"}
              />
              {keyboardStatus ? (
                <AntDesign name="close" color={colors.white} size={20} />
              ) : (
                <View style={{ width: 20 }} />
              )}
              <AppIcon
                name="check"
                size={65}
                backgroundColor={colors.primary}
                onPress={addTodo}
              />
            </View>
          )}
        </AppBar>
        <Modal
          animationType="fade"
          transparent={true}
          visible={profileModalVisible}
          onRequestClose={profileModelReqClose}
        >
          <View
            style={[
              styles.centeredView,
              { justifyContent: "flex-start", marginTop: height * 0.1 },
            ]}
          >
            <View
              style={[
                styles.modalView,
                {
                  width: "90%",
                },
              ]}
            >
              <AppRow justifyContent="space-between">
                <Text
                  style={[
                    styles.modalText,
                    { fontWeight: "bold", fontSize: 18 },
                  ]}
                >
                  Hi!! {route.params.name}
                </Text>
                <FontAwesome
                  onPress={closeProfileView}
                  name="close"
                  size={25}
                  color={colors.black}
                />
              </AppRow>

              <AppRow justifyContent="space-between">
                <Text style={{ fontSize: 15, fontWeight: 600 }}>Completed</Text>
                <Text style={{ fontSize: 15, fontWeight: 600 }}>Pending</Text>
              </AppRow>

              <AppRow>
                <View
                  style={{
                    flex: completed / total,
                    height: 20,
                    backgroundColor: colors.primary,
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ paddingHorizontal: 8, color: colors.white }}>
                    {completed}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1 - completed / total,
                    height: 20,
                    backgroundColor: colors.secondary,
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      paddingHorizontal: 8,
                      color: colors.white,
                      alignSelf: "flex-end",
                    }}
                  >
                    {pending}
                  </Text>
                </View>
              </AppRow>

              <AppButton
                onPress={navigation.goBack}
                style={[styles.closeModalBtn, { width: "30%", marginTop: 20 }]}
                title="Log Out"
              />
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={toDoModalVisible}
          onRequestClose={modelReqClose}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <React.Fragment>
                <TodoModelRowComponent
                  heading={"Title"}
                  value={todoObject.title}
                />
                <TodoModelRowComponent
                  heading={"Date"}
                  value={todoObject.date}
                />
                <TodoModelRowComponent
                  heading={"Completed"}
                  value={todoObject.completed ? "Completed" : "Pending"}
                />
                <AppButton
                  onPress={closeDetailedView}
                  style={styles.closeModalBtn}
                  title="Close"
                />
              </React.Fragment>
            </View>
          </View>
        </Modal>
        {todos.length !== 0 ? (
          <FlatList
            refreshing={fetching}
            onRefresh={() => {
              setFetching(false);
              setTodos([...todos]);
              setFetching(false);
            }}
            style={styles.list}
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <AppToDoList
                  key={item.id}
                  onPressCheckBox={() => markCompletedOnToDo(item)}
                  onPressContent={() => showDetailedView(item)}
                  onPressCross={() => deletetodo(item)}
                  data={item}
                />
              );
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>
              {!fetching ? "No Todos Match" : "Loading..."}
            </Text>
          </View>
        )}
      </View>
      <AppSliderBottomNavBar>
        <View
          style={{
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              height: 4,
              width: 30,
              borderRadius: 20,
              marginVertical: 8,
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="pluscircle" color={colors.white} size={45} />
            <Text
              style={{
                marginHorizontal: 10,
                color: colors.white,
                fontWeight: "600",
                fontSize: 18,
              }}
            >
              Add New Todo
            </Text>
          </View>
        </View>
      </AppSliderBottomNavBar>

      <AppFloatingActionButton
        backgroundColor={colors.primary}
        name={!searching ? "search1" : "plus"}
        size={65}
        onPress={toggleFAB}
      />
    </GestureHandlerRootView>
  );
}

// Helper Components
function TodoModelRowComponent({ heading, value }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <Text style={[styles.modalText, { fontWeight: "bold", fontSize: 15 }]}>
        {heading} :{" "}
      </Text>
      <Text style={styles.modalText}>{value}</Text>
    </View>
  );
}

// StyleSheet
const styles = StyleSheet.create({
  appBarStyle: {
    backgroundColor: colors.primary,
    width: "95%",
    marginTop: 10,
    borderRadius: 25,
    overflow: "hidden",
  },
  addBar: { color: colors.white, flex: 0.8 },
  button: {
    alignSelf: "flex-start",
    marginTop: 30,
    marginLeft: 40,
    width: "40%",
    height: "4%",
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalBtn: { padding: 5, alignSelf: "flex-end" },
  container: {
    flex: 1,
    backgroundColor: "#f8f4f4",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
  },
  input: {
    height: 60,
    width: "80%",
    marginTop: 30,
    borderWidth: 1,
    padding: 10,
    borderColor: colors.grey,
    borderRadius: 5,
  },
  modalText: {
    fontSize: 15,
    marginBottom: 20,
  },
  modalView: {
    marginHorizontal: 50,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchBar: { color: colors.white, flex: 0.8 },
  text: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    marginVertical: 15,
  },
  toDoContainer: {
    width: "100%",
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  viewHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
