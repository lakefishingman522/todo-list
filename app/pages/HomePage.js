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
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { Calendar } from "react-native-calendars";
import { useIsFocused } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";

// Custom Imports
// import colors from "../config/colors";
import { search } from "../config/utilities";
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
  FETCH_TODO,
  FETCH_TODO_CAT,
  addTodoCat,
  createTodo,
  deleteTodo,
  deleteTodoCat,
  editTodoCat,
  markTodo,
  selectTodoCat,
  setTodoWhileSearch,
} from "../features/actions";
import AppAvatar from "../components/AppAvatar";

//Util for Search
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
  const theme = useSelector((state) => state.user.themes);

  //States
  //Text Controller States
  const [taskInputController, settaskInputController] = useState({
    title: "",
    markDate: "",
  });
  const [taskSearch, settaskSearch] = useState("");
  const [chipTextController, setChipTextController] = useState("");

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
  const [todosForSearch, setTodosForSearch] = useState({
    completed: {},
    pending: {},
  });
  const colors =
    currentUser.theme === "light"
      ? theme.lightThemeColors
      : theme.darkThemeColors;
  let now = new Date().toDateString();
  let globalCompleted = Object.values(todosForSearch.completed);
  let globalPending = Object.values(todosForSearch.pending);

  //Refs
  const isAddOnFocus = useRef();
  const scrollForDateTime = useRef();
  const scrollForBN = useRef();

  //Calculate Marked Dates
  useMemo(() => {
    if (taskSearch === "") {
      let newAgendaList = [];
      let newMarkedDates = [
        ...Object.values(selectTodos.completed),
        ...Object.values(selectTodos.pending),
      ].reduce((obj, item) => {
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
      }, {});
      setAgendaList(newAgendaList);
      setMarkedDates({ ...newMarkedDates });
    }
    setTodosForSearch(selectTodos);
  }, [selectTodos]);

  //Font Importer
  let [fontsLoaded, error] = useFonts({
    Poppins_400Regular,
  });

  //Get Todos and Categories
  useEffect(() => {
    if (!selectTodos.isFetched) {
      dispatcher({ type: FETCH_TODO, payload: currentUser.userId });
    }
    if (!selectCategories.isFetched) {
      dispatcher({ type: FETCH_TODO_CAT, payload: currentUser.userId });
    }
  }, [currentUser]);

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
      }
    });

    return sub;
  }, [navigation, bottomNavVisible]);

  //Handlers

  //Todos
  const searchTodo = (newText) => {
    settaskSearch(newText);
    if (tab)
      setTodosForSearch({
        completed: search(selectTodos.completed, newText),
        pending: selectTodos.pending,
      });
    else
      setTodosForSearch({
        completed: selectTodos.completed,
        pending: search(selectTodos.pending, newText),
      });
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
        translateY.value = withSpring(height * -0.7);
        runOnJS(setBottomNavVisible)(true);
      } else {
        translateY.value = withSpring(0);
        runOnJS(setBottomNavVisible)(false);
      }
    },
  });

  if (fontsLoaded)
    return (
      <View>
        <StatusBar
          animated={true}
          backgroundColor={
            currentUser.theme === "light"
              ? theme.lightThemeColors.background
              : theme.darkThemeColors.background
          }
          barStyle={
            currentUser.theme === "light" ? "dark-content" : "light-content"
          }
        />
        <GestureHandlerRootView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
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
            <View
              style={[
                styles.toDoContainer,
                { backgroundColor: colors.background },
              ]}
            >
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
                  color={colors.text}
                  disabled={bottomNavVisible}
                  onPress={() => {
                    navigation.navigate("AgendaPage", agendaList);
                  }}
                />
              </AppRow>
              <AppBar
                size={30}
                name={"search1"}
                iconColor={colors["white"]}
                barStyle={[
                  styles.appBarStyle,
                  { backgroundColor: colors.primary },
                ]}
              >
                <View style={styles.viewHeader}>
                  <TextInput
                    style={[styles.searchBar, { color: colors.white }]}
                    onChangeText={(newText) => searchTodo(newText)}
                    value={taskSearch}
                    placeholder={"Search..."}
                    placeholderTextColor={colors.whiteYellow}
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
                  {isFocused && currentUser ? (
                    <AppAvatar
                      profileImage={currentUser.profileImage}
                      size={height * 0.07}
                      onPress={() => navigation.navigate("ProfilePage")}
                      iconColor={colors.primary}
                      backgroundColor={colors.white}
                    />
                  ) : null}
                </View>
              </AppBar>
              <View
                style={{
                  width: width,
                  height: height * 0.69,
                  // margin: 100,
                }}
              >
                <Tab.Navigator
                  style={{
                    flexDirection: "column",
                    backgroundColor: colors.background,
                    justifyContent: "space-between",
                  }}
                  screenOptions={{
                    tabBarStyle: {
                      backgroundColor: colors.background,
                      fontFamily: "Poppins_400Regular",
                      fontSize: 24,
                      elevation: 20,
                      shadowColor: colors.text,
                    },
                    tabBarLabelStyle: {
                      color: colors.text,
                      fontFamily: "Poppins_400Regular",
                      fontSize: 14,
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
                          colors={colors}
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
                          colors={colors}
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
            bgColor={
              currentUser.theme !== "light" ? colors.black : colors.secondary
            }
          >
            <View
              style={[styles.bottomNavKnob, { backgroundColor: colors.white }]}
            />
            <ScrollView ref={scrollForBN} scrollEnabled={bottomNavVisible}>
              <View style={styles.bottomNavContentV1}>
                <View style={styles.bottomNavContentV2}>
                  {!bottomNavVisible ? (
                    <Pressable
                      style={styles.addPressable}
                      onPress={() => {
                        // tempHandler();
                        translateY.value = withTiming(height * -0.7, {
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
                        <AppText
                          style={[
                            styles.pressableText,
                            { color: colors.white },
                          ]}
                        >
                          Add New Todo
                        </AppText>
                      </AppRow>
                    </Pressable>
                  ) : null}
                  <TextInput
                    ref={isAddOnFocus}
                    multiline={true}
                    numberOfLines={2}
                    style={[
                      styles.addBar,
                      { width: width * 0.92, color: colors.white },
                    ]}
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
                              colors={colors}
                              data={
                                selectCategories.objects[category.toString()]
                              }
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
                        {isFocused ? (
                          <Calendar
                            style={{
                              borderRadius: 20,
                              overflow: "hidden",
                              elevation: 20,
                              shadowColor: colors.text,
                            }}
                            theme={{
                              calendarBackground: colors.background,
                              backgroundColor: colors.background,
                              textDayStyle: {
                                color: colors.text,
                                fontFamily: "Poppins_400Regular",
                              },
                              textInactiveColor: colors.grey,
                              textSectionTitleColor: colors.text,
                              monthTextColor: colors.text,
                              textDayHeaderFontFamily: "Poppins_400Regular",
                              textMonthFontFamily: "Poppins_400Regular",
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
                                  dueDateMarker[lastItem].selectedColor ===
                                    "blue"
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
                        ) : null}
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
                          colors={colors}
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
                    <View
                      style={[
                        styles.modalView,
                        {
                          backgroundColor: colors.card,
                          shadowColor: colors.grey,
                          borderColor: colors.border,
                          borderWidth: 2,
                        },
                      ]}
                    >
                      <React.Fragment>
                        <AppText style={styles.chipModelTitle}>
                          {editTodo.title !== "" ? "Edit Chip" : "Add Chip"}
                        </AppText>
                        <TextInput
                          placeholder={editTodo.title}
                          placeholderTextColor={colors.grey}
                          autoFocus={true}
                          style={[
                            styles.chipModelInput,
                            { borderColor: colors.grey },
                          ]}
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
                      <View
                        style={[
                          styles.modalView,
                          {
                            backgroundColor: colors.white,
                            shadowColor: colors.black,
                          },
                        ]}
                      >
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
                            value={
                              todoObject.completed ? "Completed" : "Pending"
                            }
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
      </View>
    );
}

//Util Component
//For Tabs
function PopulateTodos({
  todos = [],
  fetching,
  markCompletedOnToDo,
  deletetodo,
  noTodoMessage,
  height,
  colors,
}) {
  return todos.length ? (
    <FlatList
      style={{
        backgroundColor: colors.background,
      }}
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
            colors={colors}
          />
        );
      }}
    />
  ) : (
    <View style={[styles.mainContent, { backgroundColor: colors.background }]}>
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
    marginHorizontal: 10,
    fontSize: 25,
    alignSelf: "flex-start",
    fontFamily: "Poppins_400Regular",
  },
  appBarStyle: {
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
    // backgroundColor: colors.primary,
    marginVertical: 10,
  },
  completedText: {
    paddingHorizontal: 8,
    // color: colors.white
  },
  container: {
    alignItems: "center",
    paddingTop: StatusBar.currentHeight,
  },
  input: {
    height: 60,
    width: "80%",
    marginTop: 30,
    borderWidth: 1,
    padding: 10,
    // borderColor: colors.grey,
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

    borderRadius: 10,
    padding: 20,
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
    // backgroundColor: colors.secondary,
    marginVertical: 10,
  },
  pendingText: {
    paddingHorizontal: 8,

    alignSelf: "flex-end",
  },
  pressableText: {
    marginHorizontal: 10,

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
    // borderBottomColor: colors.primary,
    transform: [{ rotate: "180deg" }],
  },
  searchBar: {
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
