import { call, put } from "redux-saga/effects";
import { SET_USER } from "../../actions";
import { getUsers } from "../requests/users";

export function* handleFetchUser(action) {
  try {
    let data = yield call(getUsers);
    yield put({ type: SET_USER, payload: { users: data } });
  } catch (error) {
    console.log(error);
  }
}
