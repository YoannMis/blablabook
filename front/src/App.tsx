import { BrowserRouter, Routes, Route } from 'react-router';
import Register from './components/Register';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
