import {
  SET_TODO,
  ADD_TODO,
  DELETE_TODO,
  MARK_TODO,
  RESET_TODO,
  SET_TODO_WHILE_SEARCH,
} from "../actions";

//Initial State
export const initialState = {
  completed: {},
  pending: {},
  isFetched: false,
  todosForSearch: { completed: {}, pending: {} },
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
        todosForSearch: { completed: {}, pending: {} },
      };
    }
    case SET_TODO: {
      return {
        ...state,
        completed: action.payload.completed,
        pending: action.payload.pending,
        isFetched: true,
        todosForSearch: {
          completed: action.payload.completed,
          pending: action.payload.pending,
        },
      };
    }
    case SET_TODO_WHILE_SEARCH: {
      return {
        ...state,
        completed: action.payload.completed,
        pending: action.payload.pending,
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
