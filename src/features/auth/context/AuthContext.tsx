"use client";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  email: string;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");

  const clearEmail = () => setEmail("");

  return (
    <AuthContext.Provider value={{ email, setEmail, clearEmail }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("");
  return context;
}
