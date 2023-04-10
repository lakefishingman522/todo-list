import { takeLatest } from "redux-saga/effects";
import { FETCH_TODO, FETCH_TODO_CAT, PERSIST, RESET } from "../actions";
import {
  handleFetchTodo,
  handleFetchTodoCategory,
  handlePersist,
} from "./handlers/todos";

export function* todoSaga1() {
  yield takeLatest(PERSIST, handlePersist);
}

export function* todoSaga2() {
  yield takeLatest(RESET, handlePersist);
}

export function* todoSaga3() {
  yield takeLatest(FETCH_TODO, handleFetchTodo);
}

export function* todoSaga4() {
  yield takeLatest(FETCH_TODO_CAT, handleFetchTodoCategory);
}
