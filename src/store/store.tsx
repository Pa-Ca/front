import auth from "./slices/auth";
import client from "./slices/client";
import business from "./slices/business";
import storage from "redux-persist/lib/storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  persistStore,
  persistReducer,
  PersistedState,
} from "redux-persist";

// Combine the reducers into a single root reducer
const reducer = combineReducers({ auth, client, business });

// Create the configuration object for redux-persist
const persistConfig = {
  storage,
  version: 4, // Change this number if you want to discard the persisted state (e.g. after a new redux state object is added  )
  key: "root",
  migrate: (state: PersistedState) => {
    if (state && state._persist.version !== persistConfig.version) {
      // If the persisted state version is different from the current version,
      // discard it by returning undefined
      return Promise.resolve(undefined);
    }
    return Promise.resolve(state);
  },
};
const persistedReducer = persistReducer(persistConfig, reducer);

// Create the Redux store using configureStore and the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Infer the RootState and AppDispatch types from the store itself
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
