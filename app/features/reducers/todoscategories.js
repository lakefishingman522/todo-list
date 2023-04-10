import {
  ADD_TODO_CAT,
  SET_TODO_CAT,
  EDIT_TODO_CAT,
  DELETE_TODO_CAT,
  SELECT_TODO_CAT,
  RESET_CATEGORY,
} from "../actions";

//Initial State
export const initialState = {
  objects: {
    1: { id: 1, selected: false, title: "🤝 Meeting" },
    2: { id: 2, selected: false, title: "📈 Review" },
    3: { id: 3, selected: false, title: "🔊 Marketing" },
    4: { id: 4, selected: false, title: "🎨 Design Project" },
    5: { id: 5, selected: false, title: "🎓 College" },
    6: { id: 6, selected: false, title: "🍿 Movie" },
  },
  noOfCategories: 6,
  isFetched: false,
};

//categories Reducer
export default function (state = initialState, action) {
  switch (action.type) {
    case RESET_CATEGORY: {
      return {
        ...state,
        objects: {},
        noOfCategories: 0,
        isFetched: false,
      };
    }
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
        objects: { ...initialState.objects, ...action.payload.objects },
        noOfCategories: action.payload.length + state.noOfCategories,
        isFetched: true,
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
