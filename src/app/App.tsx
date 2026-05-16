import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Home,
  AlertCircle,
  Stethoscope,
  Apple,
  User,
  Moon,
  Sun,
  Bell,
  Menu,
  X,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { FirstAidCards } from "./components/FirstAidCards";
import { DoctorFinder } from "./components/DoctorFinder";
import { WellnessDashboard } from "./components/WellnessDashboard";
import { Profile } from "./components/Profile";
import { EmergencySOS } from "./components/EmergencySOS";
import { HomeDashboard } from "./components/HomeDashboard";
import { Appointments } from "./components/Appointments";
import { Toaster } from "sonner";
import { ErrorBoundary } from "../components/common/ErrorBoundary";

type View = "home" | "first-aid" | "doctors" | "appointments" | "wellness" | "profile";

const navItems = [
  { id: "home" as View, icon: Home, label: "Home" },
  { id: "first-aid" as View, icon: AlertCircle, label: "First Aid" },
  { id: "doctors" as View, icon: Stethoscope, label: "Doctors" },
  { id: "appointments" as View, icon: Calendar, label: "Appts" },
  { id: "wellness" as View, icon: Apple, label: "Wellness" },
  { id: "profile" as View, icon: User, label: "Profile" },
];

const viewTitles: Record<View, string> = {
  home: "Dashboard",
  "first-aid": "First Aid Guide",
  doctors: "Find Doctors",
  appointments: "My Appointments",
  wellness: "Wellness Tracker",
  profile: "My Profile",
};

// Apply dark class on <html> immediately (before React renders)
(function () {
  try {
    const dark = JSON.parse(localStorage.getItem("ll_darkmode") || "false");
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  } catch {}
})();

export default function App() {
  const [activeView, setActiveView] = useState<View>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage("ll_darkmode", false);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  // Get user's first name for greeting
  const getFirstName = () => {
    try {
      const profile = JSON.parse(localStorage.getItem("ll_profile") || "{}");
      return profile.name ? profile.name.split(" ")[0] : "there";
    } catch {
      return "there";
    }
  };

  const navigate = (view: View) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Toaster position="top-center" richColors closeButton />

      {/* ── SIDEBAR (desktop) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="w-9 h-9 bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] bg-clip-text text-transparent">
            LifeLink
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-[#3B82F6]"
                  }`}
                />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Dark mode toggle at bottom of sidebar */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={toggleDark}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-400" />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] bg-clip-text text-transparent">
                    LifeLink
                  </span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
              <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={toggleDark}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-400" />
                  )}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger - mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {viewTitles[activeView]}
              </h1>
              {activeView === "home" && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Welcome back, {getFirstName()} 👋
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark mode toggle — top bar (desktop) */}
            <button
              onClick={toggleDark}
              className="hidden md:flex p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            <button
              onClick={() => navigate("profile")}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] flex items-center justify-center text-white text-xs font-bold hover:shadow-md transition-all"
            >
              {getFirstName()[0]?.toUpperCase() ?? "U"}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ErrorBoundary>
                {activeView === "home" && <HomeDashboard navigate={navigate} />}
                {activeView === "first-aid" && <FirstAidCards />}
                {activeView === "doctors" && <DoctorFinder />}
                {activeView === "appointments" && <Appointments />}
                {activeView === "wellness" && <WellnessDashboard />}
                {activeView === "profile" && <Profile onDarkModeChange={toggleDark} darkMode={darkMode} />}
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ── BOTTOM NAV (mobile only) ── */}
        <nav className="md:hidden flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className="relative flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all duration-200"
                >
                  {isActive && (
                    <motion.div
                      layoutId="bottom-active"
                      className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/10 to-[#6EE7D8]/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className={`relative w-5 h-5 transition-colors ${
                      isActive ? "text-[#3B82F6]" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`relative text-[10px] font-medium transition-colors ${
                      isActive ? "text-[#3B82F6]" : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Floating SOS Button */}
      <EmergencySOS />
    </div>
  );
}