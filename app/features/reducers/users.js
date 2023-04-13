import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import {
  ADD_USER,
  DELETE_USER,
  EDIT_USER,
  SET_CURRENT_USER,
  SET_USER,
  TOGGLE_THEME,
} from "../actions";

//Initial State
const initialState = {
  users: {},
  currentUser: {},
  isFetched: false,
  themes: {
    lightThemeColors: {
      ...DefaultTheme.colors,
      primary: "tomato",
      secondary: "skyblue",
      tertiary: "#00B45C",
      black: "#000",
      white: "#fff",
      grey: "grey",
      lightGray: "#d3d3d3",
      blurBlue: "#f0dddd",
      whiteYellow: "#FFFFF0",
      whiteGrey: "#f8f4f4",
      nearWhite: "#fafafa",
    },
    darkThemeColors: {
      ...DarkTheme.colors,
      primary: "tomato",
      secondary: "skyblue",
      tertiary: "#00B45C",
      black: "#000",
      white: "#fff",
      grey: "grey",
      lightGray: "#d3d3d3",
      blurBlue: "#f0dddd",
      whiteYellow: "#FFFFF0",
      whiteGrey: "#f8f4f4",
      nearWhite: "#fafafa",
    },
  },
};

//user Reducer
export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_USER: {
      state.users[action.payload.user.userId] = action.payload.user;
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
    case TOGGLE_THEME: {
      return {
        ...state,
        users: {
          ...state.users,
          [state.currentUser.userId]: {
            ...state.currentUser,
            theme: state.currentUser.theme !== "light" ? "light" : "dark",
          },
        },
        currentUser: {
          ...state.currentUser,
          theme: state.currentUser.theme !== "light" ? "light" : "dark",
        },
      };
    }
    case DELETE_USER: {
      delete state.users[action.payload.user.userId];
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}
