import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { OverviewPage } from './pages/OverviewPage';
import { CalendarPage } from './pages/CalendarPage';
import { LongTermPage } from './pages/LongTermPage';
import { ShortTermPage } from './pages/ShortTermPage';
import { ChoresPage } from './pages/ChoresPage';
import { ArchivePage } from './pages/ArchivePage';
import { SettingsPage } from './pages/SettingsPage';
import { ProjectDetail } from './pages/ProjectDetail';

function App() {
  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/long-term" element={<LongTermPage />} />
          <Route path="/long-term/:id" element={<ProjectDetail type="long-term" />} />
          <Route path="/short-term" element={<ShortTermPage />} />
          <Route path="/short-term/:id" element={<ProjectDetail type="short-term" />} />
          <Route path="/chores" element={<ChoresPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
}

export default App;
