import { takeLatest } from "redux-saga/effects";
import { CHANGE_ACCOUNT, FETCH_USER } from "../actions";
import { handleChangeAccount, handleFetchUser } from "./handlers/users";

export function* userSaga1() {
  yield takeLatest(FETCH_USER, handleFetchUser);
}

export function* userSaga2() {
  yield takeLatest(CHANGE_ACCOUNT, handleChangeAccount);
}
