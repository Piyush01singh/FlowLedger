import { motion } from "framer-motion";
import { BadgeCheck, Mail, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { isFirebaseConfigured } from "../firebase";

export default function Profile() {
  const { user } = useAuth();

  return (
    <section className="profile-page">
      <motion.article
        className="panel profile-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <header className="panel-headline">
          <div>
            <h2>Profile</h2>
            <p>Account identity and storage mode.</p>
          </div>
        </header>

        <div className="profile-details">
          <div className="profile-icon">
            <UserCircle size={64} />
          </div>
          <div>
            <h3>{user?.displayName || "Finance User"}</h3>
            <p>{user?.email || "No email available"}</p>
          </div>
        </div>

        <ul className="profile-meta">
          <li>
            <Mail size={15} />
            <span>{user?.email || "demo@velora.app"}</span>
          </li>
          <li>
            <BadgeCheck size={15} />
            <span>{isFirebaseConfigured ? "Connected to Firebase" : "Running in local demo mode"}</span>
          </li>
        </ul>
      </motion.article>
    </section>
  );
}
