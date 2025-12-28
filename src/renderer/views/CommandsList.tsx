import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCommands, setFilters } from '../store/commandsSlice';
import { fetchProjects } from '../store/projectsSlice';
import { fetchTags } from '../store/tagsSlice';

const CommandsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { commands, filters, loading } = useAppSelector((state) => state.commands);
  const { projects } = useAppSelector((state) => state.projects);
  const { tags } = useAppSelector((state) => state.tags);

  const [selectedProject, setSelectedProject] = useState<number | ''>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTags());
    dispatch(fetchCommands(undefined));
  }, [dispatch]);

  useEffect(() => {
    const tagIds = selectedTags
      .map((tagName) => tags.find((t) => t.name === tagName)?.id)
      .filter((id): id is number => id !== undefined);

    dispatch(
      setFilters({
        projectId: selectedProject || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      })
    );

    dispatch(
      fetchCommands({
        projectId: selectedProject || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      })
    );
  }, [selectedProject, selectedTags, dispatch, tags]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">Commands</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flex: 1, py: 4, overflow: 'auto' }}>
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Filter by Project</InputLabel>
            <Select
              value={selectedProject}
              label="Filter by Project"
              onChange={(e) => setSelectedProject(e.target.value as number | '')}
            >
              <MenuItem value="">All Projects</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Autocomplete
            multiple
            fullWidth
            options={tags.map((t) => t.name)}
            value={selectedTags}
            onChange={(_, newValue) => setSelectedTags(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Tags" placeholder="Select tags" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
          />
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : commands.length === 0 ? (
          <Typography color="text.secondary" align="center">
            No commands found. Create one to get started.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {commands.map((command) => (
              <Card key={command.id}>
                <CardActionArea onClick={() => navigate(`/commands/${command.id}`)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6" component="h3">
                        {command.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {command.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {command.resumen}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CommandsList;
