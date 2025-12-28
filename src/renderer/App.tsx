import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline, Fade } from '@mui/material';
import { store } from './store';
import Home from './views/Home';
import CommandsList from './views/CommandsList';
import CommandDetail from './views/CommandDetail';
import ProjectsManager from './views/ProjectsManager';
import TagsManager from './views/TagsManager';
import ConfigView from './views/ConfigView';
import Splash from './views/Splash';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#018790',
      light: '#00B7B5',
      dark: '#005461',
    },
    secondary: {
      main: '#005461',
      light: '#018790',
      dark: '#003940',
    },
    background: {
      default: '#F4F4F4',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#005461',
      secondary: '#018790',
    },
  },
});

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // 4 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showSplash ? (
          <Fade in={showSplash} timeout={600}>
            <div>
              <Splash />
            </div>
          </Fade>
        ) : (
          <Fade in={!showSplash} timeout={600}>
            <div>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/commands" element={<CommandsList />} />
                  <Route path="/commands/:id" element={<CommandDetail />} />
                  <Route path="/projects" element={<ProjectsManager />} />
                  <Route path="/tags" element={<TagsManager />} />
                  <Route path="/config" element={<ConfigView />} />
                </Routes>
              </Router>
            </div>
          </Fade>
        )}
      </ThemeProvider>
    </Provider>
  );
};

export default App;
