import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Types
import { Project } from '@tstypes/dbmodules';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk('projects/fetch', async () => {
  return await window.electronAPI.getProjects();
});

export const addProject = createAsyncThunk('projects/add', async (project: Omit<Project, 'id'>) => {
  return await window.electronAPI.createProject(project);
});

export const modifyProject = createAsyncThunk('projects/modify', async (project: Project) => {
  return await window.electronAPI.updateProject(project);
});

export const removeProject = createAsyncThunk('projects/remove', async (id: number) => {
  await window.electronAPI.deleteProject(id);
  return id;
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(modifyProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;
