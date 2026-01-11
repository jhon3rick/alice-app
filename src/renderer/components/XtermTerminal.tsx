/**
 * XtermTerminal
 *
 * Interactive terminal component using Xterm.js
 * Provides a full-featured terminal emulator with PTY support
 */

import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Typography, CircularProgress } from '@mui/material';
import { Close, Refresh } from '@mui/icons-material';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';

import { terminalThemeDark } from '@const/terminalTheme';
import { debounce } from '@utils/debounce';

import 'xterm/css/xterm.css';
import './XtermTerminal.scss';

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

    let mounted = true;

    const initTerminal = () => {
      if (!terminalRef.current || !mounted) return;

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

      // Store refs
      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      // Show terminal immediately
      setIsReady(true);

      // Initialize PTY session
      initializeTerminal(term, workingDir);

      // Fit terminal with multiple attempts
      const attemptFit = (attempts = 0) => {
        if (!mounted || attempts > 50) {
          if (attempts > 50) {
            console.warn('Failed to fit terminal after multiple attempts');
          }
          return;
        }

        try {
          if (terminalRef.current) {
            const width = terminalRef.current.offsetWidth;
            const height = terminalRef.current.offsetHeight;

            if (width > 0 && height > 0) {
              fitAddon.fit();
              console.log(`Terminal fitted successfully: ${width}x${height}`);
            } else {
              console.log(`Attempt ${attempts}: Waiting for dimensions (${width}x${height})`);
              // Retry after a short delay
              setTimeout(() => attemptFit(attempts + 1), 50);
            }
          }
        } catch (error) {
          console.error('Error fitting terminal:', error);
        }
      };

      // Start fitting attempts after a brief delay to let DOM settle
      setTimeout(() => attemptFit(), 50);

      // Handle resize with debounce
      const handleResize = debounce(() => {
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
      }, 500);

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        mounted = false;
        window.removeEventListener('resize', handleResize);
        if (terminalId) {
          window.electronAPI.closeTerminal(terminalId);
        }
        term.dispose();
      };
    };

    // Use setTimeout to ensure component is fully mounted
    const timeoutId = setTimeout(initTerminal, 0);

    return () => {
      clearTimeout(timeoutId);
      mounted = false;
    };
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
    <div className="xterm-terminal-wrapper">
      <div className="xterm-terminal">
        {/* Loading overlay - shown until terminal is ready */}
        <div className={`xterm-terminal__loading ${isReady ? 'xterm-terminal__loading--hidden' : ''}`}>
          <CircularProgress size={40} className="xterm-terminal__loading-spinner" />
          <Typography variant="body2" className="xterm-terminal__loading-text">
            Loading terminal...
          </Typography>
        </div>

        {/* Terminal container - always rendered */}
        <div className="xterm-terminal__container">
          <div className="xterm-terminal__header">
            <span className="xterm-terminal__title">Terminal</span>
            <div className="xterm-terminal__actions">
              <IconButton size="small" onClick={handleRefresh} className="xterm-terminal__action-button">
                <Refresh fontSize="small" />
              </IconButton>
              {onClose && (
                <IconButton size="small" onClick={onClose} className="xterm-terminal__action-button">
                  <Close fontSize="small" />
                </IconButton>
              )}
            </div>
          </div>
          <div ref={terminalRef} className="xterm-terminal__content" />
        </div>
      </div>
    </div>
  );
};

export default XtermTerminal;
