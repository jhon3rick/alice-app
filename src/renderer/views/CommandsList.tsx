import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
} from '@mui/material';
import ViewContainer from '@ui/ViewContainer';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCommands, setFilters } from '@store/commandsSlice';
import { fetchProjects } from '@store/projectsSlice';
import { fetchTags } from '@store/tagsSlice';
import './CommandsList.scss';

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
    <ViewContainer title="commands">
      <div className="commands-list__filters">
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
      </div>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : commands.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No commands found. Create one to get started.
        </Typography>
      ) : (
        <div className="commands-list__commands">
          {commands.map((command) => (
            <Card key={command.id} className="commands-list__command-card">
              <CardActionArea onClick={() => navigate(`/commands/${command.id}`)}>
                <CardContent>
                  <div className="command-header">
                    <Typography variant="h6" component="h3">
                      {command.name}
                    </Typography>
                    <div className="command-tags">
                      {command.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
                      ))}
                    </div>
                  </div>
                  <Typography variant="body2" color="text.secondary">
                    {command.resumen}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      )}
    </ViewContainer>
  );
};

export default CommandsList;
