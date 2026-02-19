import { Link, NavLink } from "react-router-dom";
import {
  Landmark,
  LayoutDashboard,
  LogOut,
  MoonStar,
  PlusCircle,
  SunMedium,
  UserCircle2,
} from "lucide-react";

function userInitials(name, email) {
  const target = name || email || "U";
  return target
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Navbar({
  user,
  isFirebaseMode,
  onOpenAdd,
  onSignOut,
  theme,
  onToggleTheme
}) {
  const activeClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/dashboard" className="brand">
          <span className="brand-icon">
            <Landmark size={20} />
          </span>
          <strong className="brand-name">Velora</strong>
        </Link>

        <nav className="nav-links">
          <NavLink to="/dashboard" className={activeClass}>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <button type="button" className="nav-link ghost-action" onClick={onOpenAdd}>
            <PlusCircle size={16} />
            Add Transaction
          </button>
          <NavLink to="/profile" className={activeClass}>
            <UserCircle2 size={16} />
            Profile
          </NavLink>
        </nav>

        <div className="topbar-actions">
          <button type="button" className="icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunMedium size={17} /> : <MoonStar size={17} />}
          </button>

          <div className="profile-chip">
            <span className="avatar-fallback">{userInitials(user?.displayName, user?.email)}</span>
            <span className="profile-text">
              <strong>{user?.displayName || "Finance User"}</strong>
              <small>{user?.email || "demo@velora.app"}</small>
            </span>
          </div>

          {isFirebaseMode ? (
            <button type="button" className="icon-btn" onClick={onSignOut} aria-label="Sign out">
              <LogOut size={17} />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
