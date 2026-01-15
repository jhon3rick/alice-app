import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
import { CommandTemplate } from '@tstypes/dbmodules';

interface CommandTemplatesState {
  commandTemplates: CommandTemplate[];
  currentCommandTemplate: CommandTemplate | null;
  loading: boolean;
  error: string | null;
  filters: {
    projectId?: number;
    tagIds?: number[];
  };
}

const initialState: CommandTemplatesState = {
  commandTemplates: [],
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

const commandTemplatesSlice = createSlice({
  name: 'commandTemplates',
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
        state.commandTemplates = action.payload;
      })
      .addCase(fetchCommandTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch commands';
      })
      .addCase(fetchCommandTemplate.fulfilled, (state, action) => {
        state.currentCommandTemplate = action.payload;
      })
      .addCase(addCommandTemplate.fulfilled, (state, action) => {
        state.commandTemplates.push(action.payload);
      })
      .addCase(modifyCommandTemplate.fulfilled, (state, action) => {
        const index = state.commandTemplates.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.commandTemplates[index] = action.payload;
        }
      })
      .addCase(removeCommandTemplate.fulfilled, (state, action) => {
        state.commandTemplates = state.commandTemplates.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setFilters, clearCurrentCommandTemplate } = commandTemplatesSlice.actions;
export default commandTemplatesSlice.reducer;
