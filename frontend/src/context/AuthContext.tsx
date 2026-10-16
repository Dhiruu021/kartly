"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IUser } from "@/lib/types";
import { api } from "@/lib/api";

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("kartly_token");
      if (token) {
        try {
          const { user } = await api.getMe();
          setUser(user);
        } catch (err) {
          localStorage.removeItem("kartly_token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await api.login(email, password);
    localStorage.setItem("kartly_token", token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token, user } = await api.register(name, email, password);
    localStorage.setItem("kartly_token", token);
    setUser(user);
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem("kartly_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
