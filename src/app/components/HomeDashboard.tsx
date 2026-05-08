import { motion } from "motion/react";
import {
  AlertCircle,
  Stethoscope,
  Apple,
  Heart,
  Droplets,
  Activity,
  Calendar,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import { useLocalStorage, todayKey } from "../hooks/useLocalStorage";

type View = "home" | "first-aid" | "doctors" | "wellness" | "profile";

interface Props {
  navigate: (view: View) => void;
}

interface HabitState {
  water: number;
  sleep: number;
  exercise: number;
  steps: number;
  date: string;
}

const defaultHabits: HabitState = { water: 0, sleep: 0, exercise: 0, steps: 0, date: todayKey() };

export function HomeDashboard({ navigate }: Props) {
  const [rawHabits] = useLocalStorage<HabitState>("ll_habits", defaultHabits);
  const habits = rawHabits.date === todayKey() ? rawHabits : defaultHabits;

  const [savedBMI] = useLocalStorage<number | null>("ll_saved_bmi", null);
  const [profile] = useLocalStorage("ll_profile", { name: "", bloodGroup: "", emergencyName: "" });
  const [savedDoctors] = useLocalStorage<string[]>("ll_saved_doctors", []);

  const appointments = (() => {
    try {
      return JSON.parse(localStorage.getItem("ll_appointments") || "[]") as any[];
    } catch {
      return [];
    }
  })();

  const upcomingAppointments = appointments
    .filter((a) => a.date >= todayKey())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const waterPct = Math.round((habits.water / 8) * 100);
  const stepsPct = Math.round((habits.steps / 10000) * 100);
  const exercisePct = Math.round((habits.exercise / 45) * 100);

  const quickActions = [
    {
      id: "first-aid" as View,
      icon: AlertCircle,
      label: "First Aid",
      desc: "Emergency guides",
      gradient: "from-red-500 to-orange-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-500",
    },
    {
      id: "doctors" as View,
      icon: Stethoscope,
      label: "Find Doctor",
      desc: "Book appointment",
      gradient: "from-[#3B82F6] to-[#6EE7D8]",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-[#3B82F6]",
    },
    {
      id: "wellness" as View,
      icon: Apple,
      label: "Wellness",
      desc: "Track your health",
      gradient: "from-[#6EE7D8] to-green-500",
      bg: "bg-teal-50 dark:bg-teal-900/20",
      iconColor: "text-teal-500",
    },
    {
      id: "profile" as View,
      icon: Shield,
      label: "Profile",
      desc: "Health info & SOS",
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-500",
    },
  ];

  const statCards = [
    {
      label: "Water Today",
      value: `${habits.water}/8`,
      unit: "glasses",
      pct: waterPct,
      icon: Droplets,
      color: "text-[#3B82F6]",
      bar: "from-[#3B82F6] to-[#6EE7D8]",
    },
    {
      label: "Exercise",
      value: `${habits.exercise}/45`,
      unit: "mins",
      pct: exercisePct,
      icon: Activity,
      color: "text-green-500",
      bar: "from-green-400 to-emerald-500",
    },
    {
      label: "Steps",
      value: habits.steps.toLocaleString(),
      unit: `/ 10,000`,
      pct: stepsPct,
      icon: TrendingUp,
      color: "text-orange-500",
      bar: "from-orange-400 to-amber-500",
    },
    {
      label: "BMI",
      value: savedBMI ? String(savedBMI) : "—",
      unit: savedBMI ? (savedBMI < 18.5 ? "Underweight" : savedBMI < 25 ? "Normal" : savedBMI < 30 ? "Overweight" : "Obese") : "Not set",
      pct: null,
      icon: Heart,
      color: savedBMI && savedBMI < 25 ? "text-green-500" : "text-orange-500",
      bar: "from-pink-400 to-red-400",
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] p-6 text-white shadow-lg"
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -right-2 w-28 h-28 bg-white/5 rounded-full" />
        <div className="relative">
          <p className="text-blue-100 text-sm mb-1">Good day{profile.name ? `, ${profile.name}` : ""}!</p>
          <h2 className="text-2xl font-bold mb-2">Your Health at a Glance</h2>
          <p className="text-blue-100 text-sm max-w-md">
            {profile.bloodGroup ? `Blood group: ${profile.bloodGroup} · ` : ""}
            {savedDoctors.length} doctor{savedDoctors.length !== 1 ? "s" : ""} saved ·{" "}
            {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} booked
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => navigate(action.id)}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`${action.bg} rounded-2xl p-4 text-left border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-200 group`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 shadow-md group-hover:shadow-lg transition-shadow`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{action.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Today's Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              onClick={() => navigate("wellness")}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-gray-400 dark:text-gray-500">{stat.label}</span>
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{stat.unit}</div>
              {stat.pct !== null && (
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    className={`h-1.5 rounded-full bg-gradient-to-r ${stat.bar}`}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Grid — Appointments + Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h3>
            </div>
            <button
              onClick={() => navigate("doctors")}
              className="text-xs text-[#3B82F6] flex items-center gap-1 hover:underline"
            >
              Book <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No upcoming appointments</p>
              <button
                onClick={() => navigate("doctors")}
                className="mt-3 text-xs text-[#3B82F6] hover:underline"
              >
                Find a doctor →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {apt.doctor?.split(" ").pop()?.[0] ?? "D"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{apt.doctor}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{apt.specialization}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-[#3B82F6]">{apt.slot}</p>
                    <p className="text-xs text-gray-400">{apt.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Daily Health Tips</h3>
          </div>
          <div className="space-y-3">
            {[
              { tip: "Drink a glass of water first thing in the morning.", color: "bg-blue-500" },
              { tip: "Take a 5-minute walk break every hour.", color: "bg-green-500" },
              { tip: "Sleep 7–8 hours for optimal recovery.", color: "bg-purple-500" },
              { tip: "Eat at least 5 portions of fruits & vegetables daily.", color: "bg-orange-500" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`mt-1.5 w-2 h-2 rounded-full ${item.color} flex-shrink-0`} />
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.tip}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
