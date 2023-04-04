import { combineReducers } from "redux";
import todoReducer from "./todos";
import userReducer from "./users";
import categoriesReducer from "./todoscategories";

const rootReducer = combineReducers({
  todo: todoReducer,
  user: userReducer,
  categories: categoriesReducer,
});

export default rootReducer;
