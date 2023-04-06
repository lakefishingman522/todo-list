import {
  SET_TODO,
  ADD_TODO,
  DELETE_TODO,
  MARK_TODO,
  RESET_TODO,
} from "../actions";

//Initial State
const initialState = {
  completed: {},
  pending: {},
  isFetched: false,
};

//todo Reducer
export default function (state = initialState, action) {
  switch (action.type) {
    case RESET_TODO: {
      return {
        ...state,
        completed: {},
        pending: {},
        isFetched: false,
      };
    }
    case SET_TODO: {
      return {
        ...state,
        completed: action.payload.completed,
        pending: action.payload.pending,
        isFetched: true,
      };
    }
    case ADD_TODO: {
      state.pending[action.payload.todo.id] = action.payload.todo;
      return {
        ...state,
      };
    }
    case DELETE_TODO: {
      if (action.payload.todo.completed)
        delete state.completed[action.payload.todo.id];
      else delete state.pending[action.payload.todo.id];

      return {
        ...state,
      };
    }
    case MARK_TODO: {
      action.payload.todo.completed = !action.payload.todo.completed;
      if (action.payload.todo.completed) {
        delete state.pending[action.payload.todo.id];
        state.completed[action.payload.todo.id] = action.payload.todo;
      } else {
        delete state.completed[action.payload.todo.id];
        state.pending[action.payload.todo.id] = action.payload.todo;
      }
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}
