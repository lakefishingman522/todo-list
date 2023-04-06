//Action Constants
//todos
export const MARK_TODO = "MARK_TODO";
export const DELETE_TODO = "DELETE_TODO";
export const ADD_TODO = "ADD_TODO";
export const SET_TODO = "SET_TODO";
export const RESET_TODO = "RESET_TODO";

//users
export const ADD_USER = "ADD_USER";
export const EDIT_USER = "EDIT_USER";
export const SET_USER = "SET_USER";
export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const FETCH_USER = "FETCH_USER";

//categories
export const ADD_TODO_CAT = "ADD_TODO_CAT";
export const EDIT_TODO_CAT = "EDIT_TODO_CAT";
export const DELETE_TODO_CAT = "DELETE_TODO_CAT";
export const SET_TODO_CAT = "SET_TODO_CAT";
export const SELECT_TODO_CAT = "SELECT_TODO_CAT";
export const RESET_CATEGORY = "RESET_CATEGORY";

//Action Creater
//todos
export const createTodo = (content) => ({
  type: ADD_TODO,
  payload: content,
});

export const markTodo = (item) => ({
  type: MARK_TODO,
  payload: { todo: item },
});

export const setTodo = (content) => ({
  type: SET_TODO,
  payload: content,
});

export const deleteTodo = (dItem) => ({
  type: DELETE_TODO,
  payload: { todo: dItem },
});

export const resetTodoState = () => ({
  type: RESET_TODO,
});

//users
export const addUser = (content) => ({
  type: ADD_USER,
  payload: content,
});

export const editUser = (content) => ({
  type: EDIT_USER,
  payload: content,
});

export const setUser = (content) => ({
  type: SET_USER,
  payload: content,
});

export const setCurrentUser = (content) => ({
  type: SET_CURRENT_USER,
  payload: content,
});

export const fetchUser = () => ({
  type: FETCH_USER,
});

//categories
export const addTodoCat = (content) => ({
  type: ADD_TODO_CAT,
  payload: content,
});

export const editTodoCat = (id, newText) => ({
  type: EDIT_TODO_CAT,
  payload: {
    id: id,
    text: newText,
  },
});

export const deleteTodoCat = (dItem) => ({
  type: DELETE_TODO_CAT,
  payload: { dItem: dItem },
});

export const setTodoCat = (content) => ({
  type: SET_TODO_CAT,
  payload: content,
});

export const selectTodoCat = (id) => ({
  type: SELECT_TODO_CAT,
  payload: id,
});

export const resetCategoriesState = () => ({
  type: RESET_CATEGORY,
});
