import { BrowserRouter, Routes, Route } from 'react-router';
import Register from './components/Register';
import HomePage from './components/HomePage';
import BookDetails from './components/BookDetails';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/category/:id" element={<BookDetails />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
