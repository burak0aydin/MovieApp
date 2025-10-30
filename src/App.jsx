import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ShowDetail from './components/ShowDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show/:id" element={<ShowDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
