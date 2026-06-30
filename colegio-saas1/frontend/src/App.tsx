import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PanelColegioRescue from './pages/warm/PanelColegioRescue';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/panel-warm" replace />} />
        <Route path="/panel-warm" element={<PanelColegioRescue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
