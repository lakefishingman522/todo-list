import { call, put } from "redux-saga/effects";
import { SET_USER, resetCategoriesState, resetTodoState } from "../../actions";
import { getUsers } from "../requests/users";
import { persistTodo, persistTodoCategories } from "../requests/todos";
import { setCurrentUser } from "../../actions";

export function* handleFetchUser(action) {
  try {
    let data = yield call(getUsers);
    yield put({ type: SET_USER, payload: { users: data } });
  } catch (error) {
    console.log(error);
  }
}

export function* handleChangeAccount(action) {
  try {
    let data1 = yield call(persistTodo, action.payload.store);
    let data2 = yield call(persistTodoCategories, action.payload.store);

    if (data1 + data2 === 400) {
      yield put(resetTodoState());
      yield put(resetCategoriesState());
      yield put(setCurrentUser({ user: action.payload.user }));
    }
  } catch (error) {
    console.log(error);
  }
}
