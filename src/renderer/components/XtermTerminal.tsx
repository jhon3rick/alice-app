/**
 * XtermTerminal
 *
 * Interactive terminal component using Xterm.js
 * Provides a full-featured terminal emulator with PTY support
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Typography, CircularProgress } from '@mui/material';
import { Close, Refresh } from '@mui/icons-material';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { terminalThemeDark } from '@const/terminalTheme';
import 'xterm/css/xterm.css';

interface XtermTerminalProps {
  workingDir?: string;
  onClose?: () => void;
  commandToExecute?: string;
}

const XtermTerminal: React.FC<XtermTerminalProps> = ({ workingDir, onClose, commandToExecute }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [terminalId, setTerminalId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const lastCommandRef = useRef<string>('');

  useEffect(() => {
    if (!terminalRef.current) return;

    // Wait for the next animation frame to ensure DOM is fully painted
    requestAnimationFrame(() => {
      if (!terminalRef.current) return;

      // Create terminal instance
      const term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: terminalThemeDark,
        cols: 80,
        rows: 24,
      });

      // Add addons
      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);

      // Open terminal in DOM
      term.open(terminalRef.current);

      // Store refs before fitting
      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      // Fit terminal after ensuring it's fully rendered
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            if (terminalRef.current && terminalRef.current.offsetWidth > 0) {
              fitAddon.fit();
              setIsReady(true);
            }
          } catch (error) {
            console.error('Error fitting terminal:', error);
          }
        }, 150);
      });

      // Initialize PTY session
      initializeTerminal(term, workingDir);

      // Handle resize with debounce
      let resizeTimeout: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          try {
            if (terminalRef.current && terminalRef.current.offsetWidth > 0) {
              fitAddon.fit();
              if (terminalId) {
                window.electronAPI.resizeTerminal(terminalId, term.cols, term.rows);
              }
            }
          } catch (error) {
            console.error('Error resizing terminal:', error);
          }
        }, 100);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (terminalId) {
          window.electronAPI.closeTerminal(terminalId);
        }
        term.dispose();
      };
    });
  }, []);

  const initializeTerminal = async (term: Terminal, cwd?: string) => {
    try {
      // Use home directory as default if no cwd is provided
      const defaultCwd = cwd || (typeof window !== 'undefined' ? '' : '');
      const id = await window.electronAPI.createTerminal(defaultCwd, term.cols, term.rows);
      setTerminalId(id);

      // Listen for data from PTY
      window.electronAPI.onTerminalData(id, (data: string) => {
        term.write(data);
      });

      // Send data from terminal to PTY
      term.onData((data) => {
        window.electronAPI.writeToTerminal(id, data);
      });
    } catch (error) {
      term.writeln(`\x1b[31mError initializing terminal: ${error}\x1b[0m`);
    }
  };

  const handleRefresh = () => {
    if (xtermRef.current && terminalId) {
      xtermRef.current.clear();
      window.electronAPI.closeTerminal(terminalId);
      initializeTerminal(xtermRef.current, workingDir);
    }
  };

  // Execute command when commandToExecute changes
  useEffect(() => {
    if (commandToExecute && terminalId && commandToExecute !== lastCommandRef.current) {
      lastCommandRef.current = commandToExecute;
      // Write command to terminal and execute it
      window.electronAPI.writeToTerminal(terminalId, commandToExecute + '\r');
    }
  }, [commandToExecute, terminalId]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#1e1e1e',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#2d2d30',
          px: 2,
          py: 1,
          borderBottom: '1px solid #3e3e42',
        }}
      >
        <Typography variant="body2" sx={{ color: '#cccccc', fontWeight: 500 }}>
          Terminal
        </Typography>
        <Box>
          <IconButton size="small" onClick={handleRefresh} sx={{ color: '#cccccc', mr: 1 }}>
            <Refresh fontSize="small" />
          </IconButton>
          {onClose && (
            <IconButton size="small" onClick={onClose} sx={{ color: '#cccccc' }}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box
        ref={terminalRef}
        sx={{
          flex: 1,
          overflow: 'hidden',
          p: 1,
          position: 'relative',
        }}
      >
        {!isReady && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CircularProgress size={32} sx={{ color: '#4ec9b0' }} />
            <Typography variant="body2" sx={{ color: '#cccccc' }}>
              Initializing terminal...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default XtermTerminal;
