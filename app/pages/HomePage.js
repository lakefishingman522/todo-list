// Default or Third Party Library Imports
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  TextInput,
  FlatList,
  Modal,
  Keyboard,
  useWindowDimensions,
  Pressable,
  ToastAndroid,
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import "react-native-reanimated";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";

// Custom Imports
import colors from "../config/colors";
import axios from "axios";
import AppToDoList from "../components/AppToDoList";
import AppBar from "../components/AppBar";
import AppIcon from "../components/AppIcon";
import AppButton from "../components/AppButton";
import search from "../config/search";
import AppSliderBottomNavBar from "../components/AppSliderBottomNavBar";
import AppRow from "../components/AppRow";
import AppChip from "../components/AppChip";
import { Calendar } from "react-native-calendars";
import AppText from "../components/AppText";
import AppSizedBox from "../components/AppSizedBox";
import AppLine from "../components/AppLine";

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

let todosForSearch = [];

export default function HomePage({ route, navigation }) {
  //States
  const { height, width } = useWindowDimensions();
  const [taskInputController, settaskInputController] = useState("");
  const [taskSearch, settaskSearch] = useState("");
  const [todos, setTodos] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const isAddOnFocus = useRef();
  const [bottomNavVisible, setBottomNavVisible] = useState(false);
  const [todoCategories, setTodoCategories] = useState([
    { id: 1, title: "Meeting", selected: false },
    { id: 2, title: "Review", selected: false },
    { id: 3, title: "Marketing", selected: false },
    { id: 4, title: "Design Project", selected: false },
  ]);
  const [editTodo, setEditTodo] = useState({});
  const [chipTextController, setChipTextController] = useState("");

  let [total, completed, pending] = useTodos(todos);
  //Font Importer
  let [fontsLoaded, error] = useFonts({
    Poppins_400Regular,
  });

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
      todosForSearch = newTodos;
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

  //Listener For Bottom Nav Bar
  useEffect(() => {
    if (fontsLoaded) {
      if (bottomNavVisible) {
        isAddOnFocus.current.focus();
      } else isAddOnFocus.current.blur();
    }
  }, [bottomNavVisible]);

  //Handlers
  const onPressProfileIcon = () => {
    [total, completed, pending] = useTodos(todos);
    setProfileModalVisible(true);
  };

  const addTodo = () => {
    if (taskInputController.trim() === "") return;
    translateY.value = withTiming(0);
    let newTodos = [
      {
        userId: route.params.id,
        id: Math.random(),
        title: taskInputController.trim(),
        completed: false,
        date: new Date().toString().slice(0, 24),
      },
      ...todos,
    ];

    settaskInputController("");
    setTodos(newTodos);
    todosForSearch = newTodos;
    setBottomNavVisible(false);
  };

  const closeProfileView = () => setProfileModalVisible(false);

  const deletetodo = (item) => {
    let newTodos = todos.filter((todo) => {
      if (todo.id != item.id) return todo;
    });

    setTodos(newTodos);
  };

  const markCompletedOnToDo = (item) => {
    let newTodos = todos.filter((todo) => {
      if (todo.id == item.id) todo.completed = !todo.completed;

      return todo;
    });

    setTodos(newTodos);
  };

  const profileModelReqClose = () => setToDoModalVisible(!profileModalVisible);

  const chipModelReqClose = () => {
    if (editTodo.title.trim() === "") {
      ToastAndroid.show("-Enter Chip Name", ToastAndroid.SHORT);
      return;
    }
    setEditTodo({});
  };

  const searchTodo = (newText) => {
    settaskSearch(newText);
    setTodos(search(todosForSearch, newText));
  };

  const editChipOnLongPress = (id) =>
    setEditTodo({ ...todoCategories[id - 1] });

  const saveChipChange = (newTitle) => {
    if (newTitle.trim() === "") {
      ToastAndroid.show("_Enter Chip Name", ToastAndroid.SHORT);
      return;
    }
    todoCategories[editTodo.id - 1].title = editTodo.title = newTitle.trim();
    setTodoCategories([...todoCategories]);
    setChipTextController("");
    chipModelReqClose();
  };

  const selectChip = (id) => {
    todoCategories[id - 1].selected = !todoCategories[id - 1].selected;
    setTodoCategories([...todoCategories]);
  };

  const createNewChip = () => {
    let newTodo = {
      id: todoCategories.length + 1,
      title: "",
      selected: true,
    };
    setTodoCategories([...todoCategories, newTodo]);
    setEditTodo({ ...newTodo });
  };

  //Bottom NavBar Gesture
  const translateY = useSharedValue(0);
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      if (height * 0.675 >= (event.translationY + context.startY) * -1)
        translateY.value = event.translationY + context.startY;
    },
    onEnd: () => {
      let h = (height * 0.8) / 2;
      if (h <= translateY.value * -1) {
        translateY.value = withSpring(height * -0.675);
        runOnJS(setBottomNavVisible)(true);
      } else {
        translateY.value = withSpring(0);
        runOnJS(setBottomNavVisible)(false);
        runOnJS(settaskInputController)("");
      }
    },
  });

  const translateX = useSharedValue(0);
  const panGestureEventChips = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      // if (event.translationX + context.startX > 0)
      translateX.value = event.translationX + context.startX;
    },
    onEnd: () => {
      console.log(translateX.value);
      // translateX.value = withSpring(0);
    },
  });
  const animatedStyleChips = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (fontsLoaded)
    return (
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.toDoContainer}>
          <AppBar
            size={30}
            name={"search1"}
            iconColor="white"
            barStyle={[
              styles.appBarStyle,
              keyboardStatus ? { height: "11.8%" } : {},
            ]}
          >
            <View style={styles.viewHeader}>
              <TextInput
                style={styles.searchBar}
                onChangeText={(newText) => searchTodo(newText)}
                value={taskSearch}
                placeholder={"Search..."}
                placeholderTextColor={"#FFFFF0"}
              />
              {keyboardStatus || taskSearch != "" ? (
                <AppSizedBox width={30} height={20}>
                  <AntDesign
                    name="close"
                    onPress={() => {
                      settaskSearch("");
                      setTodos(search(todosForSearch, ""));
                    }}
                    color={colors.white}
                    size={20}
                  />
                </AppSizedBox>
              ) : (
                <AppSizedBox width={20} height={20} />
              )}
              <AppIcon
                name="user"
                size={50}
                iconColor={colors.primary}
                backgroundColor={colors.white}
                onPress={onPressProfileIcon}
              />
            </View>
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
                {
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  marginTop: height * 0.09,
                },
              ]}
            >
              <View
                style={[styles.profileTriangle, { marginRight: width * 0.11 }]}
              />
              <View
                style={[
                  styles.modalView,
                  {
                    width: width * 0.9,
                    alignSelf: "center",
                  },
                ]}
              >
                <AppRow justifyContent="space-between">
                  <AppText style={styles.modalText}>
                    Hi!! {route.params.name}
                  </AppText>
                  <FontAwesome
                    onPress={closeProfileView}
                    name="close"
                    size={25}
                    color={colors.black}
                  />
                </AppRow>

                <AppRow justifyContent="space-between">
                  <AppText style={styles.analysisBar}>Completed</AppText>
                  <AppText style={styles.analysisBar}>Pending</AppText>
                </AppRow>

                <AppRow>
                  <View
                    style={[styles.completedBar, { flex: completed / total }]}
                  >
                    <AppText style={styles.completedText}>{completed}</AppText>
                  </View>
                  <View
                    style={[styles.pendingBar, { flex: 1 - completed / total }]}
                  >
                    <AppText style={styles.pendingText}>{pending}</AppText>
                  </View>
                </AppRow>

                <AppButton
                  onPress={navigation.goBack}
                  style={[
                    styles.closeModalBtn,
                    { width: "30%", marginTop: 20 },
                  ]}
                  title="Log Out"
                />
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
              style={!keyboardStatus ? { marginBottom: height * 0.09 } : {}}
              data={todos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <AppToDoList
                    key={item.id}
                    onPressCheckBox={() => markCompletedOnToDo(item)}
                    onPressCross={() => deletetodo(item)}
                    data={item}
                  />
                );
              }}
            />
          ) : (
            <View style={styles.mainContent}>
              <AppText style={styles.loading}>
                {!fetching ? "No Todos Match" : "Loading..."}
              </AppText>
            </View>
          )}
        </View>
        <AppSliderBottomNavBar
          translateY={translateY}
          panGestureEvent={panGestureEvent}
        >
          <View style={styles.bottomNavContentV1}>
            <View style={styles.bottomNavContentV2}>
              <View style={styles.bottomNavContentV3} />
              {!bottomNavVisible ? (
                <Pressable
                  style={styles.addPressable}
                  onPress={() => {
                    translateY.value = withTiming(height * -0.675, {
                      duration: 500,
                      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    });
                    setBottomNavVisible(true);
                  }}
                >
                  <AppRow alignItems="center">
                    <AntDesign
                      name="pluscircle"
                      color={colors.white}
                      size={45}
                    />
                    <AppText style={styles.pressableText}>Add New Todo</AppText>
                  </AppRow>
                </Pressable>
              ) : null}
              <TextInput
                ref={isAddOnFocus}
                style={styles.addBar}
                onChangeText={settaskInputController}
                value={taskInputController}
                placeholder={"What do you want to do?"}
                placeholderTextColor={"rgba(255, 255, 255, 0.3)"}
              />

              <PanGestureHandler onGestureEvent={panGestureEventChips}>
                <Animated.View
                  style={[
                    {
                      justifyContent: "flex-start",
                      flexDirection: "row",
                      width: width * 2,
                      marginHorizontal: 18,
                      rowGap: 12.5,
                      columnGap: 15,
                      flexWrap: "wrap",
                      marginTop: 30,
                      // backgroundColor: "red",
                    },
                    animatedStyleChips,
                  ]}
                >
                  {todoCategories.map((category) => (
                    <Pressable
                      key={category.id}
                      onPress={() => selectChip(category.id)}
                      onLongPress={() => editChipOnLongPress(category.id)}
                    >
                      <AppChip data={category} />
                    </Pressable>
                  ))}
                  <AppIcon
                    name="plus"
                    size={42}
                    iconColor={colors.black}
                    backgroundColor={colors.white}
                    style={styles.addIcon}
                    onPress={createNewChip}
                  />
                </Animated.View>
              </PanGestureHandler>
              <View
                style={{
                  width: width * 0.75,
                  marginVertical: 20,
                }}
              >
                <Calendar />
              </View>
              <AppLine />
            </View>
            <AppRow>
              <AppButton
                style={styles.addFinalizingButton}
                title="Cancel"
                onPress={() => {
                  translateY.value = withTiming(0);
                  setBottomNavVisible(false);
                }}
              />
              <AppButton
                style={styles.addFinalizingButton}
                title="Save"
                onPress={addTodo}
              />
            </AppRow>
            <Modal
              animationType="slide"
              transparent={true}
              visible={JSON.stringify(editTodo) !== "{}"}
              onRequestClose={chipModelReqClose}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <React.Fragment>
                    <AppText style={styles.chipModelTitle}>
                      {editTodo.title !== "" ? "Edit Chip" : "Add Chip"}
                    </AppText>
                    <TextInput
                      placeholder={editTodo.title}
                      autoFocus={true}
                      style={styles.chipModelInput}
                      onChangeText={(newText) => setChipTextController(newText)}
                    />
                    <AppRow alignSelf="flex-end">
                      <AppButton
                        onPress={chipModelReqClose}
                        style={styles.chipModelClose}
                        title="Close"
                      />
                      <AppButton
                        onPress={() => saveChipChange(chipTextController)}
                        style={styles.chipModelSave}
                        title="Save"
                      />
                    </AppRow>
                  </React.Fragment>
                </View>
              </View>
            </Modal>
          </View>
        </AppSliderBottomNavBar>
      </GestureHandlerRootView>
    );
}

// StyleSheet
const styles = StyleSheet.create({
  analysisBar: { fontSize: 15, fontFamily: "Poppins_600SemiBold" },
  addBar: {
    color: colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: 25,
    alignSelf: "flex-start",
    fontFamily: "Poppins_400Regular",
  },
  appBarStyle: {
    backgroundColor: colors.primary,
    marginTop: 10,
    marginHorizontal: 24,
    borderRadius: 50,
    overflow: "hidden",
  },
  addIcon: { borderRadius: 5 },
  addPressable: {
    marginBottom: 10,
  },
  bottomNavContentV1: {
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  bottomNavContentV2: { alignItems: "center", width: "100%" },
  bottomNavContentV3: {
    backgroundColor: colors.white,
    height: 4,
    width: 30,
    borderRadius: 20,
    marginVertical: 8,
  },
  button: {
    alignSelf: "flex-start",
    marginTop: 30,
    marginLeft: 40,
    width: "40%",
    height: "4%",
    borderRadius: 10,
  },
  addFinalizingButton: {
    width: 80,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chipModelInput: {
    marginBottom: 20,
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  chipModelClose: {
    width: 60,
    height: 30,
    marginVertical: 10,
    marginLeft: 100,
  },
  chipModelSave: {
    width: 60,
    height: 30,
    marginVertical: 10,
    marginLeft: 10,
  },
  chipModelTitle: { fontFamily: "Poppins_700Bold" },
  closeModalBtn: { padding: 5, alignSelf: "flex-end" },
  completedBar: {
    height: 20,
    backgroundColor: colors.primary,
    marginVertical: 10,
  },
  completedText: { paddingHorizontal: 8, color: colors.white },
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
  loading: { fontSize: 20 },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "Poppins_700Bold",
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
  pendingBar: {
    height: 20,
    backgroundColor: colors.secondary,
    marginVertical: 10,
  },
  pendingText: {
    paddingHorizontal: 8,
    color: colors.white,
    alignSelf: "flex-end",
  },
  pressableText: {
    marginHorizontal: 10,
    color: colors.white,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  profileTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.primary,
    transform: [{ rotate: "180deg" }],
  },
  searchBar: {
    color: colors.white,
    flex: 0.8,
    fontFamily: "Poppins_400Regular",
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
