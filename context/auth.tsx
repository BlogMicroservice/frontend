"use client";
import React, { createContext, useState, ReactNode } from "react";

// Define the shape of your context
interface AuthContextType {
  userName?: string;
  profileImage?: string;
  setUserName: (name: string) => void;
  setProfileImage: (url: string) => void;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  userName: undefined,
  profileImage: undefined,
  setUserName: () => {},
  setProfileImage: () => {},
});

// Create the context provider
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | undefined>();
  const [profileImage, setProfileImage] = useState<string | undefined>();

  return (
    <AuthContext.Provider value={{ userName, profileImage, setUserName, setProfileImage }}>
      {children}
    </AuthContext.Provider>
  );
}
