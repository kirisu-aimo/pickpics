import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeScreen from './HomeScreen';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}
