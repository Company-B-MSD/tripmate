import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing authentication on app load
    const savedAuth = localStorage.getItem('isAuth') === 'true';
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedAuth && savedToken) {
      setIsAuthenticated(true);
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user data:', error);
        }
      }
    }
  }, []);

  const login = (authToken, userData = null) => {
    setIsAuthenticated(true);
    setToken(authToken);
    
    // Store in localStorage
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('token', authToken);
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('isAuth');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Function to get authorization header for API calls
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      token, 
      user, 
      login, 
      logout, 
      getAuthHeader 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);