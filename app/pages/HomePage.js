import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";

import colors from "../config/colors";
import axios from "axios";
import AppToDoList from "../components/AppToDoList";
import AppBar from "../components/AppBar";
import AppFloatingActionButton from "../components/AppFloatingActionButton";
import AppIcon from "../components/AppIcon";

export default function HomePage() {
  const [taskInputController, settaskInputController] = useState("");
  const [taskSearch, settaskSearch] = useState("");
  const [todos, setTodos] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [searching, setSearching] = useState(true);

  useEffect(() => {
    async function getTodos() {
      const response = await axios(
        "https://jsonplaceholder.typicode.com/todos"
      );

      let newTodos = [...response.data].slice(156, 178);
      setTodos(newTodos);
      setFetching(false);
    }

    getTodos();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.ToDoContainer}>
        <AppBar
          size={30}
          name={searching ? "search1" : "plus"}
          iconColor="white"
          barStyle={{
            backgroundColor: colors.primary,
            width: "95%",
            marginTop: 10,
            borderRadius: 25,
            overflow: "hidden",
          }}
        >
          {searching ? (
            <TextInput
              style={{ color: colors.white, flex: 1 }}
              onChangeText={settaskSearch}
              value={taskSearch}
              placeholder={"Search..."}
              placeholderTextColor={"#FFFFF0"}
            />
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextInput
                autoFocus={!searching}
                style={{ color: colors.white, flex: 0.8 }}
                onChangeText={settaskInputController}
                value={taskInputController}
                placeholder={"What do you want to do?"}
                placeholderTextColor={"#FAF9F6"}
              />
              <AppIcon
                name="check"
                size={65}
                backgroundColor={colors.primary}
                onPress={() => {
                  if (taskInputController.trim() === "") return;
                  let newTodos = [
                    {
                      userId: 1,
                      id: todos.length + 1,
                      title: taskInputController.trim(),
                      completed: false,
                    },
                    ...todos,
                  ];
                  settaskInputController("");
                  setTodos(newTodos);
                  setSearching(!searching);
                }}
              />
            </View>
          )}
        </AppBar>
        {/* <Text style={styles.title}>Todo Items</Text> */}
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
                onPressCheckBox={() => {
                  let newTodos = todos.filter((todo) => {
                    if (todo.id == item.id) todo.completed = !todo.completed;

                    return todo;
                  });

                  setTodos(newTodos);
                }}
                onPressCross={() => {
                  let newTodos = todos.filter((todo) => {
                    if (todo.id != item.id) return todo;
                  });

                  setTodos(newTodos);
                }}
                data={item}
              />
            );
          }}
        />
      </View>
      <AppFloatingActionButton
        backgroundColor={colors.primary}
        name={!searching ? "search1" : "plus"}
        size={65}
        onPress={() => {
          setSearching(!searching);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    marginTop: 30,
    marginLeft: 40,
    width: "40%",
    height: "4%",
    borderRadius: 10,
  },
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
  ToDoContainer: {
    width: "100%",
    alignItems: "center",
    height: "100%",
  },
});
