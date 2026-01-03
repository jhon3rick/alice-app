import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Types
import { Tag } from '@tstypes/dbmodules';

interface TagsState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  tags: [],
  loading: false,
  error: null,
};

export const fetchTags = createAsyncThunk('tags/fetch', async () => {
  return await window.electronAPI.getTags();
});

export const addTag = createAsyncThunk('tags/add', async (tag: Omit<Tag, 'id'>) => {
  return await window.electronAPI.createTag(tag);
});

export const modifyTag = createAsyncThunk('tags/modify', async (tag: Tag) => {
  return await window.electronAPI.updateTag(tag);
});

export const removeTag = createAsyncThunk('tags/remove', async (id: number) => {
  await window.electronAPI.deleteTag(id);
  return id;
});

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tags';
      })
      .addCase(addTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
      })
      .addCase(modifyTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
      })
      .addCase(removeTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter(t => t.id !== action.payload);
      });
  },
});

export default tagsSlice.reducer;
