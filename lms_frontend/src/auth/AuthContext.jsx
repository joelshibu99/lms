import { createContext, useContext, useState } from "react";

/**
 * AuthContext
 * Holds authentication and role information globally
 */
const AuthContext = createContext(null);

/**
 * AuthProvider
 * Wraps the entire app and provides auth state
 */
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    return token && role ? { token, role } : null;
  });

  /**
   * Called after successful login
   */
  const login = (token, role) => {
    localStorage.setItem("access", token);
    localStorage.setItem("role", role);
    setAuth({ token, role });
  };

  /**
   * Called on manual logout or token expiry
   */
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("role");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access auth context
 */
export const useAuth = () => useContext(AuthContext);
