import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
import { CommandTemplate } from '@tstypes/dbmodules';

interface CommandTemplatesState {
  commands: CommandTemplate[];
  currentCommand: CommandTemplate | null;
  loading: boolean;
  error: string | null;
  filters: {
    projectId?: number;
    tagIds?: number[];
  };
}

const initialState: CommandTemplatesState = {
  commands: [],
  currentCommandTemplate: null,
  loading: false,
  error: null,
  filters: {},
};

export const fetchCommandTemplates = createAsyncThunk('command-templates/fetch', async (filters?: { projectId?: number; tagIds?: number[] }) => {
  return await window.electronAPI.getCommandTemplates(filters);
});

export const fetchCommandTemplate = createAsyncThunk('command-templates/fetchOne', async (id: number) => {
  return await window.electronAPI.getCommandTemplate(id);
});

export const addCommandTemplate = createAsyncThunk('command-templates/add', async (command: Omit<CommandTemplate, 'id'>) => {
  return await window.electronAPI.createCommandTemplate(command);
});

export const modifyCommandTemplate = createAsyncThunk('command-templates/modify', async (command: CommandTemplate) => {
  return await window.electronAPI.updateCommandTemplate(command);
});

export const removeCommandTemplate = createAsyncThunk('command-templates/remove', async (id: number) => {
  await window.electronAPI.deleteCommandTemplate(id);
  return id;
});

const commandsSlice = createSlice({
  name: 'commands',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ projectId?: number; tagIds?: number[] }>) => {
      state.filters = action.payload;
    },
    clearCurrentCommandTemplate: (state) => {
      state.currentCommandTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommandTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommandTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.commands = action.payload;
      })
      .addCase(fetchCommandTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch commands';
      })
      .addCase(fetchCommandTemplate.fulfilled, (state, action) => {
        state.currentCommandTemplate = action.payload;
      })
      .addCase(addCommandTemplate.fulfilled, (state, action) => {
        state.commands.push(action.payload);
      })
      .addCase(modifyCommandTemplate.fulfilled, (state, action) => {
        const index = state.commands.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.commands[index] = action.payload;
        }
      })
      .addCase(removeCommandTemplate.fulfilled, (state, action) => {
        state.commands = state.commands.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setFilters, clearCurrentCommandTemplate } = commandsSlice.actions;
export default commandsSlice.reducer;
