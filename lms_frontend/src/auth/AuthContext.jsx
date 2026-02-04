import { createContext, useContext, useState } from "react";
import { login as loginApi } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("access"),
    role: localStorage.getItem("role"),
  });

  // ✅ SINGLE login source (API + state + storage)
  const login = async (email, password) => {
    const response = await loginApi({ email, password });

    const { access, role } = response.data;

    localStorage.setItem("access", access);
    localStorage.setItem("role", role);

    setAuth({
      token: access,
      role: role,
    });

    return { access, role }; // 👈 REQUIRED for redirect
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null });
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
