import { BrowserRouter, Routes, Route } from 'react-router';
import Register from './components/Register';
import HomePage from './components/HomePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
