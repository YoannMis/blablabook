import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from './components/HomePage';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};
