import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from '@store/index';

// Views
import Splash from '@views/Splash';
import About from '@views/About';
import Home from '@views/Home';
import CommandList from '@views/CommandList';
import CommandDetail from '@views/CommandDetail';
import ProjectList from '@views/ProjectList';
import TagList from '@views/TagList';
import ConfigView from '@views/ConfigView';

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
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/splash" replace />} />
            <Route path="/splash" element={<Splash duration={4000} />} />
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
            <Route path="/commands" element={<CommandList />} />
            <Route path="/commands/:id" element={<CommandDetail />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/tags" element={<TagList />} />
            <Route path="/config" element={<ConfigView />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
