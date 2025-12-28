import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projectsSlice';
import tagsReducer from './tagsSlice';
import commandsReducer from './commandsSlice';
import configReducer from './configSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tags: tagsReducer,
    commands: commandsReducer,
    config: configReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
