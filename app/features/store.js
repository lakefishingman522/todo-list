import { applyMiddleware, createStore } from "redux";
import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

//Middlewares
const middlewares = [sagaMiddleware];

//Store
const store = createStore(rootReducer, {}, applyMiddleware(...middlewares));

//Started Saga
sagaMiddleware.run(rootSaga);

export default store;
