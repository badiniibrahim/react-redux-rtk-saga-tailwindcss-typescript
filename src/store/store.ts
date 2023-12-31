import createSagaMiddleware from "@redux-saga/core";
import { configureStore } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "redux-first-history";
import logger from "redux-logger";
import rootSaga from "./rootSaga";
import postsReducer from "../store/posts.slice";

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
    reduxTravelling: true,
    savePreviousLocations: 1,
  });

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: {
      posts: postsReducer,
      router: routerReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false })
        .concat(sagaMiddleware)
        .concat(routerMiddleware)
        .concat(logger),
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export const store = makeStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const history = createReduxHistory(store);
