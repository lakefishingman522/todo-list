// Default or Third Party Library Imports
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
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
  TapGestureHandler,
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
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom Imports
import colors from "../config/colors";
import axios from "axios";
import AppToDoList from "../components/AppToDoList";
import AppBar from "../components/AppBar";
import AppIcon from "../components/AppIcon";
import AppButton from "../components/AppButton";
import { search, deleteItem } from "../config/utilities";
import AppSliderBottomNavBar from "../components/AppSliderBottomNavBar";
import AppRow from "../components/AppRow";
import AppChip from "../components/AppChip";
import { Calendar } from "react-native-calendars";
import AppText from "../components/AppText";
import AppSizedBox from "../components/AppSizedBox";
import AppLine from "../components/AppLine";

//Util for Search
let todosForSearch = {};
let tab = 0;

//Tab Navigator
const Tab = createMaterialTopTabNavigator();

//Reducer Function
function reducer(state, action) {
  switch (action.type) {
    case "setTodos": {
      return {
        ...state,
        completed: action.completed,
        pending: action.pending,
      };
    }

    case "addTodo": {
      return {
        ...state,
        pending: [action.todo, ...state.pending],
      };
    }

    case "deleteTodo": {
      if (action.todo.completed) {
        if (tab)
          todosForSearch.completed = deleteItem(
            todosForSearch.completed,
            action.todo
          );
        return {
          ...state,
          completed: deleteItem(state.completed, action.todo),
        };
      } else {
        if (!tab)
          todosForSearch.pending = deleteItem(
            todosForSearch.pending,
            action.todo
          );
        return {
          ...state,
          pending: deleteItem(state.pending, action.todo),
        };
      }
    }

    case "markTodo": {
      action.todo.completed = !action.todo.completed;
      if (!action.todo.completed) {
        todosForSearch = {
          completed: deleteItem(todosForSearch.completed, action.todo),
          pending: [action.todo, ...todosForSearch.pending],
        };
        return {
          ...state,
          completed: deleteItem(state.completed, action.todo),
          pending: [action.todo, ...state.pending],
        };
      } else {
        todosForSearch = {
          pending: deleteItem(todosForSearch.pending, action.todo),
          completed: [action.todo, ...todosForSearch.completed],
        };
        return {
          ...state,
          pending: deleteItem(state.pending, action.todo),
          completed: [action.todo, ...state.completed],
        };
      }
    }

    default:
      break;
  }
}

export default function HomePage({ route, navigation }) {
  //States
  const { height, width } = useWindowDimensions();
  const [taskInputController, settaskInputController] = useState("");
  const [taskSearch, settaskSearch] = useState("");
  const [fetching, setFetching] = useState(true);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [bottomNavVisible, setBottomNavVisible] = useState(false);
  const [todoCategories, setTodoCategories] = useState([
    { id: 1, title: "Meeting", selected: false },
    { id: 2, title: "Review", selected: false },
    { id: 3, title: "Marketing", selected: false },
    { id: 4, title: "Design Project", selected: false },
  ]);
  const [editTodo, setEditTodo] = useState({});
  const [todoObject, setTodoObject] = useState({});
  const [chipTextController, setChipTextController] = useState("");

  const isAddOnFocus = useRef();

  const [state, dispatch] = useReducer(reducer, {
    completed: [],
    pending: [],
  });

  let markingDates = useMemo(() => {
    return [...state.completed, ...state.pending].reduce((obj, item) => {
      return {
        ...obj,
        [item.date.toISOString().slice(0, 10)]: {
          selected: true,
          marked: true,
          selectedColor: item.completed ? "green" : "red",
        },
      };
    }, {});
  }, [state]);

  let now = new Date().toDateString();

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
      let completedTodos = [];
      let pendingTodos = [];
      response.data.filter((todo) => {
        if (todo.userId === userId) {
          let y = Math.random() * (1 - 0.996) + 0.996;
          todo.date = new Date(Date.now() * y);
          if (todo.completed) completedTodos.push(todo);
          else pendingTodos.push(todo);
        }
      });
      dispatch({
        type: "setTodos",
        completed: completedTodos,
        pending: pendingTodos,
      });
      todosForSearch = {
        completed: completedTodos,
        pending: pendingTodos,
      };
      setFetching(false);
    }

    getTodos();
    // console.log(todoObject.date.toString().slice(0, 24));
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
      } else {
        isAddOnFocus.current.blur();
      }
    }
  }, [bottomNavVisible]);

  //Listener For Going Back
  useEffect(() => {
    const sub = navigation.addListener("beforeRemove", (e) => {
      if (bottomNavVisible) {
        e.preventDefault();
        translateY.value = withTiming(0, {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        setBottomNavVisible(false);
      }
    });

    return sub;
  }, [navigation, bottomNavVisible]);

  //Handlers

  //Todos
  const searchTodo = (newText) => {
    settaskSearch(newText);
    if (tab)
      dispatch({
        type: "setTodos",
        completed: search(todosForSearch.completed, newText),
        pending: state.pending,
      });
    else
      dispatch({
        type: "setTodos",
        completed: state.completed,
        pending: search(todosForSearch.pending, newText),
      });
  };
  const addTodo = () => {
    if (taskInputController.trim() === "") return;
    translateY.value = withTiming(0);

    dispatch({
      type: "addTodo",
      todo: {
        userId: route.params.id,
        id: Math.random(),
        title: taskInputController.trim(),
        completed: false,
        date: new Date(),
      },
    });

    settaskInputController("");
    setBottomNavVisible(false);
  };

  //Profile Model
  const openProfileModel = () => setProfileModalVisible(true);

  const closeProfileModel = () => setProfileModalVisible(false);

  const profileModelReqClose = () => setToDoModalVisible(!profileModalVisible);

  //Calendar Todo Shower
  const closeDetailedView = () => setTodoObject({});

  //Chips in Bottom Nav
  const chipModelReqClose = () => {
    if (editTodo.title.trim() === "") {
      ToastAndroid.show("Enter Chip Name", ToastAndroid.SHORT);
      return;
    }
    setEditTodo({});
  };

  const editChipOnLongPress = (id) => {
    for (const iterator of todoCategories) {
      if (id === iterator.id) {
        setEditTodo(iterator);
        return;
      }
    }
  };

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
    setTodoCategories(
      todoCategories.filter((item) => {
        if (item.id === id) {
          item.selected = !item.selected;
        }
        return item;
      })
    );
  };

  const createNewChip = () => {
    let newTodo = {
      id: todoCategories.length
        ? todoCategories[todoCategories.length - 1].id + 1
        : 1,
      title: "",
      selected: true,
    };
    setTodoCategories([...todoCategories, newTodo]);
    setEditTodo({ ...newTodo });
  };

  const deleteChip = () => {
    setTodoCategories(
      todoCategories.filter((item) => {
        if (item.id !== editTodo.id) return item;
      })
    );
    chipModelReqClose();
  };

  //Gesture Handlers

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

  //Chips Gestures
  const translateX = useSharedValue(200);
  const newBoxes = (todoCategories.length - 4) * 116;
  const panGestureEventChips = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      if (
        event.translationX + context.startX > 0 - newBoxes &&
        event.translationX + context.startX < 210
      )
        translateX.value = event.translationX + context.startX;
    },
    onEnd: (event) => {},
  });
  const animatedStyleChips = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (fontsLoaded)
    return (
      <GestureHandlerRootView style={styles.container}>
        <TapGestureHandler
          onBegan={() => {
            if (bottomNavVisible) {
              translateY.value = withTiming(0, {
                duration: 500,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              });
              setBottomNavVisible(false);
            }
          }}
        >
          <View style={styles.toDoContainer}>
            <AppRow
              alignSelf="flex-start"
              justifyContent="space-between"
              alignItems="center"
              style={{
                marginTop: 16,
                width: width * 0.9,
                marginHorizontal: 20,
              }}
            >
              <View>
                <AppText
                  style={{ fontFamily: "Poppins_700Bold", fontSize: 32 }}
                >
                  Today
                </AppText>
                <AppText style={{ fontFamily: "Poppins_300Light" }}>
                  {now}
                </AppText>
              </View>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={32}
                color="black"
                disabled={bottomNavVisible}
                onPress={() => {
                  navigation.navigate("AgendaPage");
                  // setBottomNavVisible(true);
                  // translateY.value = withTiming(height * -0.675, {
                  //   duration: 500,
                  //   easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                  // });
                }}
              />
            </AppRow>
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
                {(keyboardStatus || taskSearch != "") &&
                !isAddOnFocus.current.isFocused() ? (
                  <AppSizedBox width={30} height={20}>
                    <AntDesign
                      name="close"
                      onPress={() => {
                        if (taskSearch !== "") searchTodo("");
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
                  onPress={openProfileModel}
                />
              </View>
            </AppBar>
            <View
              style={{
                width: width,
                height: height * 0.69,
              }}
            >
              <Tab.Navigator
                style={{
                  flexDirection: "column",
                  backgroundColor: "#f8f4f4",
                  justifyContent: "space-between",
                }}
                screenOptions={{
                  tabBarStyle: {
                    backgroundColor: "#f8f4f4",
                    fontFamily: "Poppins_400Regular",
                    fontSize: 24,
                  },

                  tabBarIndicatorStyle: {
                    backgroundColor: colors.secondary,
                  },
                }}
              >
                <Tab.Screen
                  name="Pending"
                  children={() => {
                    return (
                      <PopulateTodos
                        navigation={navigation}
                        todos={state.pending}
                        fetching={fetching}
                        setFetching={(newValue) => setFetching(newValue)}
                        deletetodo={(item) => {
                          dispatch({ type: "deleteTodo", todo: item });
                        }}
                        markCompletedOnToDo={(item) => {
                          dispatch({ type: "markTodo", todo: item });
                        }}
                      />
                    );
                  }}
                  listeners={({ navigation, route }) => ({
                    focus: (e) => {
                      tab = 0;
                    },
                    blur: (e) => {
                      searchTodo("");
                    },
                  })}
                />
                <Tab.Screen
                  name="Completed"
                  children={() => {
                    return (
                      <PopulateTodos
                        navigation={navigation}
                        todos={state.completed}
                        fetching={fetching}
                        setFetching={(newValue) => setFetching(newValue)}
                        deletetodo={(item) => {
                          dispatch({ type: "deleteTodo", todo: item });
                        }}
                        markCompletedOnToDo={(item) => {
                          dispatch({ type: "markTodo", todo: item });
                        }}
                      />
                    );
                  }}
                  listeners={({ navigation, route }) => ({
                    focus: (e) => {
                      tab = 1;
                    },
                    blur: (e) => {
                      searchTodo("");
                      if (bottomNavVisible) {
                        translateY.value = withTiming(0, {
                          duration: 500,
                          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                        });
                        setBottomNavVisible(false);
                      }
                    },
                  })}
                />
              </Tab.Navigator>
            </View>
          </View>
        </TapGestureHandler>
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
                      alignItems: "center",
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
                  {todoCategories.length ? (
                    todoCategories.map((category, index) => (
                      <Pressable
                        key={category.id}
                        onPress={() => selectChip(category.id)}
                        onLongPress={() => editChipOnLongPress(category.id)}
                      >
                        <AppChip data={category} />
                      </Pressable>
                    ))
                  ) : (
                    <AppText style={{ color: colors.white }}>
                      Create A Chip
                    </AppText>
                  )}
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
                <Calendar
                  style={{ borderRadius: 20, overflow: "hidden" }}
                  markedDates={markingDates}
                  onDayPress={(DateData) => {
                    let todo;
                    for (const iterator of [
                      ...state.completed,
                      ...state.pending,
                    ]) {
                      if (
                        iterator.date.toISOString().slice(0, 10) ===
                        DateData.dateString
                      ) {
                        todo = iterator;
                        break;
                      }
                    }
                    setTodoObject({ ...todo });
                  }}
                />
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
                        onPress={deleteChip}
                        style={styles.chipModelSave}
                        title="Delete"
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
            {JSON.stringify(todoObject) !== "{}" ? (
              <Modal
                animationType="slide"
                transparent={true}
                visible={JSON.stringify(todoObject) !== "{}"}
                onRequestClose={closeDetailedView}
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
                        value={todoObject.date.toString().slice(0, 24)}
                      />
                      <TodoModelRowComponent
                        heading={"Status"}
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
            ) : null}
          </View>
        </AppSliderBottomNavBar>
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
                marginTop: height * 0.205,
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
                  onPress={closeProfileModel}
                  name="close"
                  size={25}
                  style={{
                    paddingLeft: 20,
                    paddingRight: 10,
                    paddingBottom: 20,
                  }}
                  color={colors.black}
                />
              </AppRow>

              <AppRow justifyContent="space-between">
                <AppText style={styles.analysisBar}>Completed</AppText>
                <AppText style={styles.analysisBar}>Pending</AppText>
              </AppRow>

              <AppRow>
                {state.completed.length ? (
                  <View
                    style={[
                      styles.completedBar,
                      {
                        flex:
                          state.completed.length /
                          (state.completed.length + state.pending.length),
                      },
                    ]}
                  >
                    <AppText style={styles.completedText}>
                      {state.completed.length}
                    </AppText>
                  </View>
                ) : null}
                {state.pending.length ? (
                  <View
                    style={[
                      styles.pendingBar,
                      {
                        flex:
                          state.pending.length /
                          (state.completed.length + state.pending.length),
                      },
                    ]}
                  >
                    <AppText style={styles.pendingText}>
                      {state.pending.length}
                    </AppText>
                  </View>
                ) : null}
              </AppRow>

              <AppButton
                onPress={navigation.goBack}
                style={[styles.closeModalBtn, { width: "30%", marginTop: 20 }]}
                title="Log Out"
              />
            </View>
          </View>
        </Modal>
      </GestureHandlerRootView>
    );
}

//Util Component
//For Tabs
function PopulateTodos({
  todos = [],
  fetching,
  setFetching,
  markCompletedOnToDo,
  deletetodo,
}) {
  return todos.length !== 0 ? (
    <FlatList
      refreshing={fetching}
      onRefresh={() => {
        setFetching(true);
        // setTodos([...todos]);
        setFetching(false);
      }}
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
        {!fetching ? "No Todos Available" : "Loading..."}
      </AppText>
    </View>
  );
}

//Model Todo
function TodoModelRowComponent({ heading, value }) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "flex-start", width: "90%" }}
    >
      <AppText style={{ fontFamily: "Poppins_700Bold", fontSize: 16 }}>
        {heading} :{" "}
      </AppText>
      <AppText style={{ fontSize: 16 }}>{value}</AppText>
    </View>
  );
}

// StyleSheet
const styles = StyleSheet.create({
  analysisBar: { fontSize: 15, fontFamily: "Poppins_600SemiBold" },
  addBar: {
    width: "100%",
    color: colors.white,
    marginLeft: 20,
    marginTop: 20,
    fontSize: 25,
    alignSelf: "flex-start",
    fontFamily: "Poppins_400Regular",
  },
  appBarStyle: {
    backgroundColor: colors.primary,
    marginTop: 10,
    marginHorizontal: 24,
    marginBottom: 10,
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
    // flex: 1,
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
  },
  viewHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
