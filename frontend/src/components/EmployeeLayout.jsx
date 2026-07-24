import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { authService } from "../api/auth";
import {
  LayoutDashboard,
  User,
  LogOut,
  Sun,
  Moon,
  BriefcaseBusiness,
} from "lucide-react";

export default function EmployeeLayout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Employee User",
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300 flex flex-col">
      {/* Top Navbar for Employee Portal */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Branding */}
          <div className="flex items-center gap-6">
            <Link
              to="/employeeDashboard"
              className="flex items-center gap-2 font-black text-lg text-slate-900 dark:text-slate-50 tracking-tight"
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <BriefcaseBusiness className="h-4 w-4" />
              </div>
              <span>
                SmartManager{" "}
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Emp
                </span>
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/employeeDashboard"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  location.pathname === "/employeeDashboard"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  location.pathname === "/profile"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50"
                }`}
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
            </nav>
          </div>

          {/* Action Buttons & Dark Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Top Nav Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-100/80 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <>
                  <Moon className="h-4 w-4 text-indigo-400" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            {/* Profile Avatar Quick Access */}
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              title="View Profile"
            >
              {user.profilePicUrl ? (
                <img
                  src={user.profilePicUrl}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "E"}
                </div>
              )}
              <span className="hidden lg:inline text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {user.name}
              </span>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70 transition"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
