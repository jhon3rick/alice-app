import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface TerminalProps {
  command: string;
  workingDir?: string;
}

const Terminal: React.FC<TerminalProps> = ({ command, workingDir }) => {
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [executed, setExecuted] = useState<boolean>(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (command && !executed) {
      executeCommand();
    }
  }, [command]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, error]);

  const executeCommand = async () => {
    setLoading(true);
    setOutput('');
    setError('');
    setExecuted(true);

    try {
      const result = await window.electronAPI.executeCommand(command, workingDir);

      if (result.success) {
        setOutput(result.stdout || 'Command executed successfully with no output.');
        if (result.stderr) {
          setError(result.stderr);
        }
      } else {
        setError(result.error || 'Unknown error occurred');
        if (result.stdout) {
          setOutput(result.stdout);
        }
      }
    } catch (err) {
      setError(`Failed to execute command: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      ref={outputRef}
      sx={{
        bgcolor: '#1e1e1e',
        color: '#d4d4d4',
        p: 2,
        borderRadius: 1,
        fontFamily: 'monospace',
        fontSize: '13px',
        maxHeight: '400px',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace',
          color: '#569cd6',
          mb: 1,
        }}
      >
        $ {command}
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
          <CircularProgress size={16} sx={{ color: '#4ec9b0' }} />
          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#4ec9b0' }}>
            Executing...
          </Typography>
        </Box>
      )}

      {output && (
        <Box sx={{ mb: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {output}
        </Box>
      )}

      {error && (
        <Box sx={{ color: '#f48771', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {error}
        </Box>
      )}

      {!loading && !output && !error && executed && (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#6a9955' }}>
          Command completed with no output.
        </Typography>
      )}
    </Box>
  );
};

export default Terminal;
