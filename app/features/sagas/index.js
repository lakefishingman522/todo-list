import { all, fork } from "redux-saga/effects";
import * as userSagas from "./users";
import * as todoSagas from "./todos";

export default function* rootSaga() {
  yield all(
    [...Object.values(userSagas), ...Object.values(todoSagas)].map(fork)
  );
}
