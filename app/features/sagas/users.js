import { takeLatest } from "redux-saga/effects";
import { CHANGE_ACCOUNT, DELETE_USER, FETCH_USER } from "../actions";
import {
  handleChangeAccount,
  handleDeleteUser,
  handleFetchUser,
} from "./handlers/users";

export function* userSaga1() {
  yield takeLatest(FETCH_USER, handleFetchUser);
}

export function* userSaga2() {
  yield takeLatest(CHANGE_ACCOUNT, handleChangeAccount);
}

export function* userSaga3() {
  yield takeLatest(DELETE_USER, handleDeleteUser);
}
