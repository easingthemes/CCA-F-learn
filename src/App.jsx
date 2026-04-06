import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DomainPage from './pages/DomainPage';
import ScenarioPage from './pages/ScenarioPage';
import Practice from './pages/Practice';
import MyProjectsOverview from './pages/MyProjectsOverview';
import MyProjectDetail from './pages/MyProjectDetail';
import CheatsheetPage from './pages/CheatsheetPage';
import QuizLanding from './pages/QuizLanding';
import QuizQuestion from './pages/QuizQuestion';
import LearningPage from './pages/LearningPage';
import Glossary from './pages/Glossary';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/CCA-F-learn">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/domains/:id" element={<DomainPage />} />
            <Route path="/scenarios/:id" element={<ScenarioPage />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/my-projects" element={<MyProjectsOverview />} />
            <Route path="/my-projects/:id" element={<MyProjectDetail />} />
            <Route path="/my-projects/:projectId/learnings/:learningId" element={<LearningPage />} />
            <Route path="/cheatsheets/:id" element={<CheatsheetPage />} />
            <Route path="/practice-quiz" element={<QuizLanding />} />
            <Route path="/practice-quiz/:sectionId" element={<QuizQuestion />} />
            <Route path="/glossary" element={<Glossary />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
