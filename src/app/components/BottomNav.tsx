import { motion } from "motion/react";
import { Home, AlertCircle, Stethoscope, Apple, User } from "lucide-react";
import { useState, useEffect } from "react";

interface NavItem {
  id: string;
  icon: any;
  label: string;
  sectionId: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: Home, label: "Home", sectionId: "home" },
  { id: "first-aid", icon: AlertCircle, label: "First Aid", sectionId: "first-aid" },
  { id: "doctors", icon: Stethoscope, label: "Doctors", sectionId: "doctors" },
  { id: "wellness", icon: Apple, label: "Wellness", sectionId: "wellness" },
  { id: "profile", icon: User, label: "Profile", sectionId: "profile" },
];

export function BottomNav() {
  const [activeTab, setActiveTab] = useState("home");

  // IntersectionObserver — updates active tab as user scrolls
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    navItems.forEach((item) => {
      const section = document.getElementById(item.sectionId);
      if (!section) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveTab(item.id);
          }
        },
        { threshold: 0.4 }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const handleTabClick = (item: NavItem) => {
    setActiveTab(item.id);
    document.getElementById(item.sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="relative mx-4 mb-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-[#6EE7D8]/5" />

        <div className="relative flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className="relative flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-300"
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className="relative z-10">
                  <item.icon
                    className={`w-6 h-6 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`relative z-10 text-xs font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 right-1/2 translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
