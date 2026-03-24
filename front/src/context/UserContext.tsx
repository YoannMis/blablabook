import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types/user';

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
