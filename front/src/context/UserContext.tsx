import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types/user';
import { Spinner } from '@chakra-ui/react';
import { axiosAuth } from '../utils/axiosAuth';

type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosAuth.get('/api/auth/me');

        setUser(response.data?.data ?? null);
      } catch (error) {
        console.error('Failed to fetch current user', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading) return <Spinner />;

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        setUser,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }

  return context;
};
