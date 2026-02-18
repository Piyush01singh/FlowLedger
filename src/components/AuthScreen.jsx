import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthScreen({ onSignIn }) {
  const { authError } = useAuth();

  return (
    <div className="auth-screen">
      <div className="auth-ambient auth-ambient-a" />
      <div className="auth-ambient auth-ambient-b" />

      <motion.section
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className="auth-tag">
          <Sparkles size={14} />
          Premium Finance Dashboard
        </span>
        <h1>Track Every Dollar With Style</h1>
        <p>
          Secure Firebase authentication, live transaction sync, editable records, and animated insights
          in one polished workspace.
        </p>

        <button type="button" className="btn-primary auth-btn" onClick={onSignIn}>
          Continue with Google
          <ArrowRight size={16} />
        </button>

        {authError ? <p className="form-error">{authError}</p> : null}
      </motion.section>
    </div>
  );
}
