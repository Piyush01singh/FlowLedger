import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import { isFirebaseConfigured } from "./firebase";

const THEME_KEY = "flowledger-theme";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "dark");
  const [addSignal, setAddSignal] = useState(0);
  const [pendingAdd, setPendingAdd] = useState(false);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (location.pathname === "/dashboard" && pendingAdd) {
      setAddSignal((prev) => prev + 1);
      setPendingAdd(false);
    }
  }, [location.pathname, pendingAdd]);

  const handleOpenAdd = () => {
    if (location.pathname !== "/dashboard") {
      setPendingAdd(true);
      navigate("/dashboard");
      return;
    }
    setAddSignal((prev) => prev + 1);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const shellClassName = useMemo(() => `app-shell theme-${theme}`, [theme]);

  if (loading) {
    return (
      <div className="splash-screen">
        <div className="pulse-dot" />
        <p>Loading your finance cockpit...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onSignIn={signInWithGoogle} />;
  }

  return (
    <div className={shellClassName}>
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <Navbar
        user={user}
        isFirebaseMode={isFirebaseConfigured}
        onOpenAdd={handleOpenAdd}
        onSignOut={signOutUser}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="content-shell">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard openAddSignal={addSignal} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
