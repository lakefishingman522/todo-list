import {
  ADD_USER,
  EDIT_USER,
  FETCH_REQ_FAILED,
  SET_CURRENT_USER,
  SET_USER,
} from "../actions";

//Initial State
const initialState = {
  users: {},
  currentUser: {},
  isFetched: false,
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
        isFetched: true,
      };
    }
    case SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.payload.user,
      };
    }
    // case FETCH_REQ_FAILED:
    //   return {
    //     ...state,
    //     isFetched: false,
    //   };
    default:
      return state;
  }
}
