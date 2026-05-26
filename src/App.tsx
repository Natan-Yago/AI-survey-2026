import { Navigate, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import QuestionPage from './pages/QuestionPage';
import SummaryPage from './pages/SummaryPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/q/:num" element={<QuestionPage />} />
      <Route path="/summary" element={<SummaryPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
