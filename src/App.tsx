import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SeminarDashboard from './Screens/SeminarDashboard';
import AddSeminar from './Screens/AddSeminar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<SeminarDashboard />} />
        <Route path="/seminar/post" element={<AddSeminar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
