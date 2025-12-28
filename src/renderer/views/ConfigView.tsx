import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import { ArrowBack, Save, Download, Upload } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchConfig, updateConfigValue } from '../store/configSlice';

const ConfigView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { config } = useAppSelector((state) => state.config);

  const [configPath, setConfigPath] = useState('');
  const [exportPath, setExportPath] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  useEffect(() => {
    setConfigPath(config.configPath || '');
    setExportPath(config.exportPath || '');
  }, [config]);

  const handleSave = async () => {
    try {
      await dispatch(updateConfigValue({ key: 'configPath', value: configPath }));
      await dispatch(updateConfigValue({ key: 'exportPath', value: exportPath }));
      setSnackbar({ open: true, message: 'Configuration saved successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save configuration', severity: 'error' });
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const result = await window.electronAPI.importJson(file.path);
          if (result.success) {
            setSnackbar({ open: true, message: 'JSON imported successfully', severity: 'success' });
          } else {
            setSnackbar({ open: true, message: `Import failed: ${result.error}`, severity: 'error' });
          }
        } catch (error) {
          setSnackbar({ open: true, message: 'Failed to import JSON', severity: 'error' });
        }
      }
    };
    input.click();
  };

  const handleExport = async () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `alice-export-${timestamp}.json`;
      const fullPath = `${exportPath}/${filename}`;

      const result = await window.electronAPI.exportJson(fullPath);
      if (result.success) {
        setSnackbar({ open: true, message: `Exported to ${fullPath}`, severity: 'success' });
      } else {
        setSnackbar({ open: true, message: `Export failed: ${result.error}`, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to export JSON', severity: 'error' });
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">Configuration</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flex: 1, py: 4, overflow: 'auto' }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Application Settings
          </Typography>

          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              label="Config Path"
              value={configPath}
              onChange={(e) => setConfigPath(e.target.value)}
              helperText="Directory where JSON configuration files are stored"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Export Path"
              value={exportPath}
              onChange={(e) => setExportPath(e.target.value)}
              helperText="Directory where exported JSON files will be saved"
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{ mb: 4 }}
            >
              Save Configuration
            </Button>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Import/Export
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Import JSON files to update the database, or export current database to JSON format.
          </Alert>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={handleImport}
            >
              Import JSON
            </Button>

            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
            >
              Export to JSON
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfigView;
