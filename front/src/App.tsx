import { BrowserRouter, Routes, Route } from 'react-router';
import { UserProvider } from './context/UserContext';
import Register from './components/Register';
import HomePage from './components/HomePage';
import BookDetails from './components/BookDetails';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Account from './components/Account';
import PublicRoute from './components/PublicRoute';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:category/:id" element={<BookDetails />} />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
