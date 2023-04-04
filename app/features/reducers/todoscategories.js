import { deleteItem } from "../../config/utilities";
import {
  ADD_TODO_CAT,
  SET_TODO_CAT,
  EDIT_TODO_CAT,
  DELETE_TODO_CAT,
  SELECT_TODO_CAT,
} from "../actions";

//Initial State
const initialState = {
  objects: {},
  noOfCategories: 0,
};

//categories Reducer
export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TODO_CAT: {
      state.objects[action.payload.newCategory.id] = action.payload.newCategory;
      return {
        ...state,
        categories: { ...state.objects },
        noOfCategories: state.noOfCategories + 1,
      };
    }
    case SET_TODO_CAT: {
      return {
        ...state,
        objects: { ...action.payload.objects },
        noOfCategories: action.payload.length,
      };
    }
    case SELECT_TODO_CAT: {
      state.objects[action.payload].selected =
        !state.objects[action.payload].selected;
      return {
        ...state,
        categories: { ...state.objects },
      };
    }
    case EDIT_TODO_CAT: {
      state.objects[action.payload.id].title = action.payload.text;
      return {
        ...state,
        categories: { ...state.objects },
      };
    }
    case DELETE_TODO_CAT: {
      delete state.objects[action.payload.dItem.id];
      return {
        ...state,
        categories: { ...state.objects },
        noOfCategories: state.noOfCategories - 1,
      };
    }
    default:
      return state;
  }
}
