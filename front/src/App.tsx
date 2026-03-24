import { BrowserRouter, Routes, Route } from 'react-router';
import { UserProvider } from './context/UserContext';
import Register from './components/Register';
import HomePage from './components/HomePage';
import BookDetails from './components/BookDetails';
import Login from './components/Login';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:category/:id" element={<BookDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
