import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
} from '@mui/material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCommands, setFilters } from '@store/commandsSlice';

// Custom Components
import ViewContainer from '@ui/ViewContainer';
import SelectProject from '@components/SelectProject';
import SelectTags from '@components/SelectTags';

import './CommandList.scss';

const CommandList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { commands, loading } = useAppSelector((state) => state.commands);
  const { tags } = useAppSelector((state) => state.tags);

  const [selectedProject, setSelectedProject] = useState<number | ''>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
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
      <div className="command-list__filters">
        <SelectProject
          value={selectedProject}
          onChange={setSelectedProject}
        />

        <SelectTags
          value={selectedTags}
          onChange={setSelectedTags}
        />
      </div>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : commands.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No commands found. Create one to get started.
        </Typography>
      ) : (
        <div className="command-list__commands">
          {commands.map((command) => (
            <Card key={command.id} className="command-list__command-card">
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

export default CommandList;
