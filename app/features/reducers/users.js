import { ADD_USER, EDIT_USER, SET_CURRENT_USER, SET_USER } from "../actions";

//Initial State
const initialState = {
  users: {},
  currentUser: {},
};

//user Reducer
export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_USER: {
      state.users[action.payload.user.id] = action.payload.user;
      return {
        ...state,
      };
    }
    case EDIT_USER: {
      return state;
    }
    case SET_USER: {
      return {
        ...state,
        users: { ...action.payload.users },
      };
    }
    case SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.payload.user,
      };
    }
    default:
      return state;
  }
}
