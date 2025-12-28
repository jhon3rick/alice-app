import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Config } from '../types';

interface ConfigState {
  config: Config;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  config: {
    configPath: '',
    exportPath: '',
  },
  loading: false,
  error: null,
};

export const fetchConfig = createAsyncThunk('config/fetch', async () => {
  return await window.electronAPI.getConfig();
});

export const updateConfigValue = createAsyncThunk(
  'config/update',
  async ({ key, value }: { key: string; value: string }) => {
    return await window.electronAPI.updateConfig(key, value);
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as Record<string, string>;
        state.config = {
          configPath: payload.configPath || '',
          exportPath: payload.exportPath || '',
        };
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch config';
      })
      .addCase(updateConfigValue.fulfilled, (state, action) => {
        const { key, value } = action.payload;
        (state.config as any)[key] = value;
      });
  },
});

export default configSlice.reducer;
