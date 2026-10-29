import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function readStorage() {
  try {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      return { token: savedToken, user: JSON.parse(savedUser) };
    }
  } catch (_) {}
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage().user);
  const [token, setToken] = useState(() => readStorage().token);

  const login = (tokenVal, userData) => {
    localStorage.setItem("token", tokenVal);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
