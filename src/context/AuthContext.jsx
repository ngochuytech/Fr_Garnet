import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getProfile } from '../features/profile/services/profileSerivce';
import {logoutService} from '../services/authContextService';

const AuthContext = createContext(null);

const TOKEN_KEY = 'campushub_token';
const USER_KEY = 'campushub_user';

/**
 * Provides authentication state and actions to the app.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync user profile from server if token exists
  useEffect(() => {
    const refreshUser = async () => {
      if (token && !user?.bio) {
        try {
          const fullProfile = await getProfile();
          updateUser(fullProfile);
        } catch (error) {
          console.error("Failed to refresh user profile:", error);
        }
      }
    };
    refreshUser();
  }, [token, user?.bio]);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const updateUser = useCallback((newUserData) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...newUserData };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to consume AuthContext.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
