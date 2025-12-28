import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CommandTemplate } from '../types';

interface CommandsState {
  commands: CommandTemplate[];
  currentCommand: CommandTemplate | null;
  loading: boolean;
  error: string | null;
  filters: {
    projectId?: number;
    tagIds?: number[];
  };
}

const initialState: CommandsState = {
  commands: [],
  currentCommand: null,
  loading: false,
  error: null,
  filters: {},
};

export const fetchCommands = createAsyncThunk(
  'commands/fetch',
  async (filters?: { projectId?: number; tagIds?: number[] }) => {
    return await window.electronAPI.getCommands(filters);
  }
);

export const fetchCommand = createAsyncThunk('commands/fetchOne', async (id: number) => {
  return await window.electronAPI.getCommand(id);
});

export const addCommand = createAsyncThunk('commands/add', async (command: Omit<CommandTemplate, 'id'>) => {
  return await window.electronAPI.createCommand(command);
});

export const modifyCommand = createAsyncThunk('commands/modify', async (command: CommandTemplate) => {
  return await window.electronAPI.updateCommand(command);
});

export const removeCommand = createAsyncThunk('commands/remove', async (id: number) => {
  await window.electronAPI.deleteCommand(id);
  return id;
});

const commandsSlice = createSlice({
  name: 'commands',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ projectId?: number; tagIds?: number[] }>) => {
      state.filters = action.payload;
    },
    clearCurrentCommand: (state) => {
      state.currentCommand = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommands.fulfilled, (state, action) => {
        state.loading = false;
        state.commands = action.payload;
      })
      .addCase(fetchCommands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch commands';
      })
      .addCase(fetchCommand.fulfilled, (state, action) => {
        state.currentCommand = action.payload;
      })
      .addCase(addCommand.fulfilled, (state, action) => {
        state.commands.push(action.payload);
      })
      .addCase(modifyCommand.fulfilled, (state, action) => {
        const index = state.commands.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.commands[index] = action.payload;
        }
      })
      .addCase(removeCommand.fulfilled, (state, action) => {
        state.commands = state.commands.filter(c => c.id !== action.payload);
      });
  },
});

export const { setFilters, clearCurrentCommand } = commandsSlice.actions;
export default commandsSlice.reducer;
