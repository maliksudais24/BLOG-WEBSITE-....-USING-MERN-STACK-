import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await api.post('/user/login', {
        username: usernameOrEmail,
        email: usernameOrEmail,
        password,
      });

      const { User, accesstoken, refreshtoken } = response.data.data;
      
      // Store user and tokens in localStorage
      localStorage.setItem('user', JSON.stringify(User));
      localStorage.setItem('token', accesstoken);
      localStorage.setItem('refreshtoken', refreshtoken);
      
      setUser(User);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const signup = async (fullname, username, email, password, confirmPassword) => {
    try {
      const response = await api.post('/user/Singup', {
        fullname,
        username,
        email,
        password,
      });

      const { User } = response.data.data;
      
      // Auto login after signup
      localStorage.setItem('user', JSON.stringify(User));
      
      setUser(User);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/user/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage and state regardless of API call result
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshtoken');
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

