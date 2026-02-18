import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "../firebase";

const AuthContext = createContext(null);

const demoUser = {
  uid: "demo-user",
  displayName: "Demo Analyst",
  email: "demo@flowledger.app",
  photoURL: ""
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser(demoUser);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      () => {
        setAuthError("Unable to verify your account. Please refresh.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setUser(demoUser);
      return;
    }

    try {
      setAuthError("");
      await signInWithPopup(auth, googleProvider);
    } catch {
      setAuthError("Google sign-in failed. Check Firebase auth settings.");
    }
  };

  const signOutUser = async () => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      signInWithGoogle,
      signOutUser
    }),
    [authError, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
