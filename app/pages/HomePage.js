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
  Keyboard,
  useWindowDimensions,
  Pressable,
  ToastAndroid,
  Image,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import {
  useSharedValue,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
  withTiming,
  Easing,
} from "react-native-reanimated";
import "react-native-reanimated";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { Calendar } from "react-native-calendars";

// Custom Imports
import colors from "../config/colors";
import { search, deleteItem } from "../config/utilities";
import AppToDoList from "../components/AppToDoList";
import AppBar from "../components/AppBar";
import AppRoundedIcon from "../components/AppRoundedIcon";
import AppButton from "../components/AppButton";
import AppSliderBottomNavBar from "../components/AppSliderBottomNavBar";
import AppRow from "../components/AppRow";
import AppChip from "../components/AppChip";
import AppText from "../components/AppText";
import AppSizedBox from "../components/AppSizedBox";
import AppLine from "../components/AppLine";
import AppAnalogClock from "../components/AppAnalogClock";
import AppIcon from "../components/AppIcon";
import {
  addTodoCat,
  resetTodoState,
  createTodo,
  deleteTodo,
  deleteTodoCat,
  editTodoCat,
  markTodo,
  selectTodoCat,
  setTodo,
  setTodoCat,
  resetCategoriesState,
} from "../features/actions";
import { useIsFocused } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";

//Util for Search
let todosForSearch = {};
let tab = 0;

//Tab Navigator
const Tab = createMaterialTopTabNavigator();

export default function HomePage({ route, navigation }) {
  //Dispatcher
  const dispatcher = useDispatch();

  //Selectors
  const selectTodos = useSelector((state) => state.todo);
  const selectCategories = useSelector((state) => state.categories);
  const currentUser = useSelector((state) => state.user.currentUser);

  //States
  //Text Controller States
  const [taskInputController, settaskInputController] = useState({
    title: "",
    markDate: "",
  });
  const [taskSearch, settaskSearch] = useState("");
  const [chipTextController, setChipTextController] = useState("");
  const [fetching, setFetching] = useState();

  //Listener States
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [bottomNavVisible, setBottomNavVisible] = useState(false);
  const isFocused = useIsFocused();

  //Model States
  const [editTodo, setEditTodo] = useState({});
  const [todoObject, setTodoObject] = useState({});

  //Calendar State
  const [dueDateMarker, setDueDateMarker] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [agendaList, setAgendaList] = useState([]);

  //Utils
  const [time, setTime] = useState(new Date());
  const { height, width } = useWindowDimensions();
  let now = new Date().toDateString();
  let globalCompleted = [];
  let globalPending = [];
  Object.keys(selectTodos.completed).filter((key) => {
    globalCompleted.push(selectTodos.completed[key.toString()]);
  });
  Object.keys(selectTodos.pending).filter((key) => {
    globalPending.push(selectTodos.pending[key.toString()]);
  });

  //Refs
  const isAddOnFocus = useRef();
  const scrollForDateTime = useRef();
  const scrollForBN = useRef();

  //Calculate Marked Dates
  useMemo(() => {
    if (taskSearch === "") {
      let newAgendaList = [];
      let newMarkedDates = [...globalCompleted, ...globalPending].reduce(
        (obj, item) => {
          item.date = new Date(item.dueDate).toISOString().slice(0, 10);
          newAgendaList.push(item);
          return {
            ...obj,
            [new Date(item.dueDate).toISOString().slice(0, 10)]: {
              selected: true,
              marked: true,
              selectedColor: item.completed ? "green" : "red",
            },
          };
        },
        {}
      );
      setAgendaList(newAgendaList);
      setMarkedDates({ ...newMarkedDates });
    }
  }, [selectTodos]);

  //Font Importer
  let [fontsLoaded, error] = useFonts({
    Poppins_400Regular,
  });

  //Get Todos and Categories
  useEffect(() => {
    async function getTodos() {
      console.log("Get Data Called");
      const jsonValue = await AsyncStorage.getItem(
        `@todos_${currentUser.userId}`
      );
      const parsedData = JSON.parse(jsonValue);

      if (parsedData) dispatcher(setTodo(parsedData));
      else dispatcher(setTodo({ completed: {}, pending: {} }));

      todosForSearch = parsedData;
    }

    async function getCategories() {
      const jsonValue = await AsyncStorage.getItem(
        `@todosCategories_${currentUser.userId}`
      );
      const parsedData = JSON.parse(jsonValue);
      if (parsedData) {
        dispatcher(
          setTodoCat({
            objects: parsedData,
            length: Object.keys(parsedData).length,
          })
        );
      } else {
        dispatcher(
          setTodoCat({
            objects: {},
            length: 0,
          })
        );
      }
    }

    if (!selectTodos.isFetched) {
      getTodos();
    }
    if (!selectCategories.isFetched) {
      getCategories();
    }
  }, [isFocused]);

  //DB Setters

  //Todos
  useEffect(() => {
    if (!fetching && taskSearch === "") {
      async function setDB() {
        const jsonValue = JSON.stringify({
          ...selectTodos,
        });
        await AsyncStorage.setItem(`@todos_${currentUser.userId}`, jsonValue)
          .then((value) => {
            console.log("DB Setted");
            return 200;
          })
          .catch((err) => {
            ToastAndroid.show(
              "Unable to Connect... Try Again",
              ToastAndroid.SHORT
            );
            console.log("Error");
            return 400;
          });
      }
      if (selectTodos.isFetched) setDB();
    }
  }, [selectTodos]);

  //Categories
  useEffect(() => {
    if (!fetching && taskSearch === "") {
      async function setDB() {
        const jsonValue = JSON.stringify({
          ...selectCategories.objects,
        });
        await AsyncStorage.setItem(
          `@todosCategories_${currentUser.userId}`,
          jsonValue
        )
          .then((value) => {
            return 200;
          })
          .catch((err) => {
            ToastAndroid.show(
              "Unable to Connect... Try Again",
              ToastAndroid.SHORT
            );
            console.log("Error");
            return 400;
          });
      }

      if (selectTodos.isFetched) setDB();
    }
  }, [selectCategories]);

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
        resetTaskInput();
        let keys = Object.keys(dueDateMarker);
        let lastItem = keys.length ? keys.at(keys.length - 1) : null;
        if (lastItem && dueDateMarker[lastItem].selectedColor === "blue")
          delete dueDateMarker[lastItem];

        Object.keys(selectCategories.objects).filter(
          (key) => (selectCategories.objects[key].selected = false)
        );
        scrollForDateTime.current.scrollTo();
        scrollForBN.current.scrollTo();
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
      } else {
        dispatcher(resetTodoState());
        dispatcher(resetCategoriesState());
      }
    });

    return sub;
  }, [navigation, bottomNavVisible]);

  //Handlers

  //Todos
  const searchTodo = (newText) => {
    settaskSearch(newText);
    if (tab)
      dispatcher(
        setTodo({
          completed: search(todosForSearch.completed, newText),
          pending: selectTodos.pending,
        })
      );
    else
      dispatcher(
        setTodo({
          completed: selectTodos.completed,
          pending: search(todosForSearch.pending, newText),
        })
      );
  };

  const addTodo = async () => {
    if (taskInputController["title"] === "") {
      ToastAndroid.show("Please Enter Title", ToastAndroid.SHORT);
      return;
    }
    if (taskInputController["markDate"] === "") {
      scrollForDateTime.current.scrollTo();
      ToastAndroid.show("Please Select Date", ToastAndroid.SHORT);
      return;
    }
    let markDateString = new Date(taskInputController.markDate);

    if (
      markDateString.getHours() === 5 &&
      markDateString.getMinutes() === 30 &&
      markDateString.getSeconds() === 0
    ) {
      scrollForDateTime.current.scrollToEnd({ animated: true });
      ToastAndroid.show("Please Select Time", ToastAndroid.SHORT);
      return;
    }

    let categories = [];
    Object.keys(selectCategories.objects).filter((key) => {
      // console.log(selectCategories.objects[key].selected);
      if (selectCategories.objects[key].selected) {
        categories.push(selectCategories.objects[key].title);
      }
    });

    if (categories.length === 0) {
      ToastAndroid.show("Please Select Category", ToastAndroid.SHORT);
      return;
    }

    let newTodo = {
      userId: currentUser.userId,
      id: Math.random(),
      title: taskInputController.title.trim(),
      completed: false,
      createdDate: Date.now(),
      dueDate: taskInputController.markDate,
      categories: categories,
    };

    dispatcher(createTodo({ todo: newTodo }));

    translateY.value = withTiming(0);
    setBottomNavVisible(false);
  };

  //Resetter
  const resetTaskInput = () => {
    settaskInputController({
      title: "",
      markDate: "",
    });
  };

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

  const saveChipChange = (newTitle) => {
    if (newTitle.trim() !== "") {
      editTodo.title = newTitle.trim();
      setChipTextController("");
      chipModelReqClose();
      dispatcher(editTodoCat(editTodo.id.toString(), newTitle.trim()));
      return;
    } else {
      ToastAndroid.show("_Enter Chip Name", ToastAndroid.SHORT);
    }
  };

  const createNewChip = () => {
    let newCategory = {
      id: Math.random(),
      title: "",
      selected: true,
    };
    dispatcher(addTodoCat({ newCategory: newCategory }));
    setEditTodo({ ...newCategory });
  };

  const deleteChip = () => {
    dispatcher(deleteTodoCat(editTodo));
    setEditTodo({});
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
      }
    },
  });

  if (fontsLoaded && isFocused)
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
              <AppIcon
                iconType="MaterialCommunityIcons"
                name="calendar-month-outline"
                size={32}
                color="black"
                disabled={bottomNavVisible}
                onPress={() => navigation.navigate("AgendaPage", agendaList)}
              />
            </AppRow>
            <AppBar
              size={30}
              name={"search1"}
              iconColor="white"
              barStyle={styles.appBarStyle}
            >
              <View style={styles.viewHeader}>
                <TextInput
                  style={styles.searchBar}
                  onChangeText={(newText) => searchTodo(newText)}
                  value={taskSearch}
                  placeholder={"Search..."}
                  placeholderTextColor={"#FFFFF0"}
                />
                {keyboardStatus &&
                taskSearch != "" &&
                !isAddOnFocus.current.isFocused() ? (
                  <AppSizedBox width={30} height={20}>
                    <AppIcon
                      iconType="AntDesign"
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

                {!currentUser.profileImage && isFocused ? (
                  <AppRoundedIcon
                    name="user"
                    size={50}
                    iconColor={colors.primary}
                    backgroundColor={colors.white}
                    onPress={() => navigation.navigate("ProfilePage")}
                    style={{ marginLeft: 10, overflow: "hidden" }}
                  />
                ) : (
                  <Pressable onPress={() => navigation.navigate("ProfilePage")}>
                    <Image
                      source={{ uri: currentUser.profileImage }}
                      style={{
                        width: height * 0.07,
                        height: height * 0.07,
                        borderRadius: height * 0.035,
                      }}
                    />
                  </Pressable>
                )}
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
                        height={height}
                        navigation={navigation}
                        todos={globalPending}
                        fetching={
                          selectTodos.isFetched && selectCategories.isFetched
                        }
                        setFetching={(newValue) => setFetching(newValue)}
                        deletetodo={(item) => {
                          dispatcher(deleteTodo(item));
                        }}
                        markCompletedOnToDo={(item) => {
                          dispatcher(markTodo(item));
                        }}
                        noTodoMessage={
                          !globalCompleted.length && !globalPending.length
                            ? "No Todos Added"
                            : "Wow😊 No Pending Tasks👍"
                        }
                      />
                    );
                  }}
                  listeners={({ navigation, route }) => ({
                    focus: (e) => {
                      tab = 0;
                    },
                    blur: (e) => {
                      if (taskSearch !== "") searchTodo("");
                    },
                  })}
                />
                <Tab.Screen
                  name="Completed"
                  children={() => {
                    return (
                      <PopulateTodos
                        height={height}
                        navigation={navigation}
                        todos={globalCompleted}
                        fetching={
                          selectTodos.isFetched && selectCategories.isFetched
                        }
                        setFetching={(newValue) => setFetching(newValue)}
                        deletetodo={(item) => {
                          dispatcher(deleteTodo(item));
                        }}
                        markCompletedOnToDo={(item) => {
                          dispatcher(markTodo(item));
                        }}
                        noTodoMessage={
                          !globalCompleted.length && !globalPending.length
                            ? "No Todos Added"
                            : "Keep Working💨 Complete Your Tasks👍"
                        }
                      />
                    );
                  }}
                  listeners={({ navigation, route }) => ({
                    focus: (e) => {
                      tab = 1;
                    },
                    blur: (e) => {
                      if (taskSearch !== "") searchTodo("");
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
          <View style={styles.bottomNavKnob} />
          <ScrollView ref={scrollForBN} scrollEnabled={bottomNavVisible}>
            <View style={styles.bottomNavContentV1}>
              <View style={styles.bottomNavContentV2}>
                {!bottomNavVisible ? (
                  <Pressable
                    style={styles.addPressable}
                    onPress={() => {
                      // tempHandler();
                      translateY.value = withTiming(height * -0.675, {
                        duration: 500,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                      });
                      setBottomNavVisible(true);
                    }}
                  >
                    <AppRow alignItems="center">
                      <AppIcon
                        iconType="AntDesign"
                        name="pluscircle"
                        color={colors.white}
                        size={45}
                      />
                      <AppText style={styles.pressableText}>
                        Add New Todo
                      </AppText>
                    </AppRow>
                  </Pressable>
                ) : null}
                <TextInput
                  ref={isAddOnFocus}
                  multiline={true}
                  numberOfLines={2}
                  style={[styles.addBar, { width: width * 0.92 }]}
                  onChangeText={(newText) =>
                    settaskInputController({
                      ...taskInputController,
                      title: newText,
                    })
                  }
                  value={taskInputController.title}
                  placeholder={"What do you want to do?"}
                  placeholderTextColor={"rgba(255, 255, 255, 0.3)"}
                />

                <ScrollView
                  horizontal
                  contentContainerStyle={{
                    alignItems: "center",
                  }}
                >
                  {selectCategories.noOfCategories ? (
                    Object.keys(selectCategories.objects).map(
                      (category, index) => (
                        <Pressable
                          key={category}
                          onPress={() => dispatcher(selectTodoCat(category))}
                          onLongPress={() =>
                            setEditTodo(selectCategories.objects[category])
                          }
                        >
                          <AppChip
                            data={selectCategories.objects[category.toString()]}
                          />
                        </Pressable>
                      )
                    )
                  ) : (
                    <AppText style={{ color: colors.white }}>
                      Create A Chip
                    </AppText>
                  )}
                  <AppRoundedIcon
                    name="plus"
                    size={42}
                    iconColor={colors.black}
                    backgroundColor={colors.white}
                    style={styles.addCategoryIcon}
                    onPress={createNewChip}
                  />
                </ScrollView>

                <ScrollView
                  pagingEnabled={true}
                  horizontal
                  ref={scrollForDateTime}
                >
                  <View style={{ marginHorizontal: width * 0.125 }}>
                    <View
                      style={{
                        width: width * 0.75,
                        marginTop: 15,
                      }}
                    >
                      <Calendar
                        style={{
                          borderRadius: 20,
                          overflow: "hidden",
                        }}
                        markedDates={{ ...markedDates, ...dueDateMarker }}
                        onDayPress={(DateData) => {
                          if (
                            Date.now() <= DateData.timestamp ||
                            new Date(Date.now()).getDate() === DateData.day
                          ) {
                            let keys = Object.keys(dueDateMarker);
                            let lastItem = keys.length
                              ? keys.at(keys.length - 1)
                              : null;
                            if (
                              lastItem &&
                              dueDateMarker[lastItem].selectedColor === "blue"
                            )
                              delete dueDateMarker[lastItem];

                            setDueDateMarker({
                              ...dueDateMarker,
                              [DateData.dateString]: {
                                selected: true,
                                marked: true,
                                selectedColor: "blue",
                              },
                            });
                            settaskInputController({
                              ...taskInputController,
                              markDate: DateData.timestamp,
                            });
                          } else {
                            ToastAndroid.show(
                              "Please Select a Valid Date",
                              ToastAndroid.SHORT
                            );
                          }
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ marginHorizontal: width * 0.125 }}>
                    <View
                      style={{
                        width: width * 0.75,
                        marginTop: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <AppAnalogClock
                        hour={time.getHours()}
                        minutes={time.getMinutes()}
                        seconds={time.getSeconds()}
                        showSeconds={false}
                        size={height * 0.3}
                        onPress={() => {
                          if (taskInputController.markDate === "") {
                            scrollForDateTime.current.scrollTo();
                            ToastAndroid.show(
                              "Please Select Date",
                              ToastAndroid.SHORT
                            );
                            return;
                          }
                          DateTimePickerAndroid.open({
                            mode: "time",
                            onChange: (time) => {
                              // console.log("Changed");
                              let newTime = new Date(
                                time.nativeEvent.timestamp
                              );

                              setTime(newTime);
                              settaskInputController({
                                ...taskInputController,
                                markDate: new Date(
                                  taskInputController.markDate
                                ).setHours(
                                  newTime.getHours(),
                                  newTime.getMinutes(),
                                  1
                                ),
                              });
                            },
                            value: new Date(),
                          });
                        }}
                      />
                    </View>
                  </View>
                </ScrollView>
                <AppLine />
              </View>
              <AppRow>
                <AppButton
                  style={[
                    styles.addFinalizingButton,
                    { width: width * 0.25, marginRight: 15 },
                  ]}
                  title="Cancel"
                  onPress={() => {
                    translateY.value = withTiming(0);
                    setBottomNavVisible(false);
                  }}
                />
                <AppButton
                  style={[
                    styles.addFinalizingButton,
                    { width: width * 0.25, marginRight: 10 },
                  ]}
                  title="Save"
                  onPress={addTodo}
                />
              </AppRow>
              <AppSizedBox height={20} width={width} />
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
                        onChangeText={(newText) =>
                          setChipTextController(newText)
                        }
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
          </ScrollView>
        </AppSliderBottomNavBar>
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
  noTodoMessage,
  height,
}) {
  return todos.length ? (
    <FlatList
      style={{ marginBottom: height * 0.01 }}
      refreshing={!fetching}
      onRefresh={() => {
        // setFetching(true);
        // setTodos([...todos]);
        // setFetching(false);
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
      {fetching ? (
        <AppText style={styles.loading}>{noTodoMessage}</AppText>
      ) : (
        <ActivityIndicator
          animating={!fetching}
          color={colors.primary}
          size={50}
        />
      )}
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
    color: colors.white,
    marginHorizontal: 10,
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
  addCategoryIcon: { borderRadius: 5, marginHorizontal: 15 },
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
  bottomNavKnob: {
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
    padding: 8,
    borderRadius: 10,
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
  loading: { fontSize: 20, paddingHorizontal: 20 },
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
