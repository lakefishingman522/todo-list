import { call, put } from "redux-saga/effects";
import {
  getTodos,
  getTodosCategory,
  persistTodo,
  persistTodoCategories,
} from "../requests/todos";
import {
  RESET,
  resetCategoriesState,
  resetTodoState,
  setTodo,
  setTodoCat,
} from "../../actions";
import { setUsers } from "../requests/users";

export function* handlePersist(action) {
  try {
    let data1 = yield call(persistTodo, action.payload);
    let data2 = yield call(persistTodoCategories, action.payload);
    let result = yield call(setUsers, action.payload);

    if (data1 != 200) console.log("DB Todo Not Setted");
    else {
      if (action.type === RESET) yield put(resetTodoState());
    }

    if (data2 != 200) console.log("DB Catgories Not Setted");
    else {
      if (action.type === RESET) yield put(resetCategoriesState());
    }
  } catch (error) {
    console.log(error);
  }
}

export function* handleFetchTodo(action) {
  try {
    let dataTodos = yield call(getTodos, action.payload);

    if (dataTodos && dataTodos.completed && dataTodos.pending)
      yield put(setTodo(dataTodos));
    else yield put(setTodo({ completed: {}, pending: {} }));
  } catch (error) {
    console.log(error);
  }
}

export function* handleFetchTodoCategory(action) {
  try {
    let dataTodosCategory = yield call(getTodosCategory, action.payload);

    if (dataTodosCategory)
      yield put(
        setTodoCat({
          objects: dataTodosCategory,
          length: Object.keys(dataTodosCategory).length,
        })
      );
    else
      yield put(
        setTodoCat({
          objects: {},
          length: 6,
        })
      );
  } catch (error) {
    console.log(error);
  }
}
