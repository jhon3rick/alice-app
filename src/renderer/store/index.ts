import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projectsSlice';
import tagsReducer from './tagsSlice';
import commandsReducer from './commandsSlice';
import configReducer from './configSlice';

import stateChangeLogger from "./middlewares/stateChangeLogger";

const isDevelopment = process.env.NODE_ENV === 'development';
const combineReducers = {
  projects: projectsReducer,
  tags: tagsReducer,
  commands: commandsReducer,
  config: configReducer,
};

export const store = configureStore({
  devTools: isDevelopment,
  reducer: combineReducers,
  middleware: (getDefaultMiddleware) =>{
    const base = getDefaultMiddleware({ serializableCheck: false });
    return isDevelopment ? base.concat(stateChangeLogger()) : base;
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
