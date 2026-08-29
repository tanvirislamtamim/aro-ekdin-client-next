"use client";

import React, { createContext, useEffect, useState, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import auth from "../firebase/firebase.config";
import axios from "axios";
import { AuthContextType } from "../types";

export const AuthContext = createContext<AuthContextType | null>(null);

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const createUser = (email: string, password: string) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email: string, password: string) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateProfile = (profileInfo: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) return Promise.reject("No user logged in");
    return firebaseUpdateProfile(auth.currentUser, profileInfo);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        const userInfo = { email: currentUser.email };
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://aro-ekdin-server-side-my0t.onrender.com";

        axios
          .post(`${apiUrl}/jwt`, userInfo)
          .then((res) => {
            if (res.data?.token && typeof window !== "undefined") {
              localStorage.setItem("access-token", res.data.token);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error("JWT sync error:", err);
            setLoading(false);
          });
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access-token");
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo: AuthContextType = {
    createUser,
    signIn,
    user,
    loading,
    logOut,
    signInWithGoogle,
    updateProfile,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
