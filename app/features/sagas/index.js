import { takeLatest } from "redux-saga/effects";
import { FETCH_USER } from "../actions";
import { handleFetchUser } from "./handlers/users";

export default function* rootSaga() {
  yield takeLatest(FETCH_USER, handleFetchUser);
}
