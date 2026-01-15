import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { ThemeProvider } from '@contexts/ThemeContext';

import '@styles/_global.scss';

// Views
import Splash from '@views/Splash';
import About from '@views/About';
import Home from '@views/Home';
import CmdTemplateList from '@views/CmdTemplateList';
import CmdTemplateForm from '@views/CmdTemplateForm';
import CmdTemplateExecutor from '@views/CmdTemplateExecutor';
import ProjectList from '@views/ProjectList';
import TagList from '@views/TagList';
import Config from '@views/Config';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/splash" replace />} />
            <Route path="/splash" element={<Splash duration={4000} />} />
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cmd-templates" element={<CmdTemplateList />} />
            <Route path="/cmd-templates/new" element={<CmdTemplateForm />} />
            <Route path="/cmd-templates/:id/edit" element={<CmdTemplateForm />} />
            <Route path="/cmd-templates/:id/execute" element={<CmdTemplateExecutor />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/tags" element={<TagList />} />
            <Route path="/config" element={<Config />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
