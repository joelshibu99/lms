import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("access"),
  });

  const login = (token) => {
    localStorage.setItem("access", token);
    setAuth({ token });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null });
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
