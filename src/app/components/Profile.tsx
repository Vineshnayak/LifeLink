import { motion } from "motion/react";
import { User, Phone, ShieldCheck, ChevronRight, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { toast } from "sonner";

interface ProfileProps {
  darkMode: boolean;
  onDarkModeChange: () => void;
}

const CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Allergies",
  "Arthritis",
  "None",
];

export function Profile({ darkMode, onDarkModeChange }: ProfileProps) {
  const [profile, setProfile] = useLocalStorage("ll_profile", {
    name: "",
    age: "",
    bloodGroup: "",
    emergencyName: "",
    emergencyPhone: "",
    conditions: [] as string[],
  });

  const [draft, setDraft] = useState(profile);

  const toggleCondition = (condition: string) => {
    setDraft((prev) => {
      const has = prev.conditions.includes(condition);
      return {
        ...prev,
        conditions: has
          ? prev.conditions.filter((c) => c !== condition)
          : [...prev.conditions, condition],
      };
    });
  };

  const save = () => {
    setProfile(draft);
    toast.success("Profile saved!", { description: "Your details are stored securely on this device." });
  };

  const bloodGroups = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

  return (
    <div id="profile" className="py-8 px-4 min-h-full bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] bg-clip-text text-transparent">
            My Profile
          </h2>
          <p className="text-lg text-gray-600">
            Your health info, stored privately on this device
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={draft.age}
                  onChange={(e) => setDraft({ ...draft, age: e.target.value })}
                  placeholder="Your age"
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  value={draft.bloodGroup}
                  onChange={(e) => setDraft({ ...draft, bloodGroup: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all bg-white"
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Emergency Contact</h3>
            </div>
            <p className="text-sm text-red-600 mb-4">This contact will be shown during SOS emergencies.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={draft.emergencyName}
                  onChange={(e) => setDraft({ ...draft, emergencyName: e.target.value })}
                  placeholder="e.g. Mom, Dad, Spouse"
                  className="w-full px-4 py-3 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={draft.emergencyPhone}
                  onChange={(e) => setDraft({ ...draft, emergencyPhone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Medical Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6EE7D8] to-green-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Medical Conditions</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {CONDITIONS.map((condition) => {
                const isSelected = draft.conditions.includes(condition);
                return (
                  <button
                    key={condition}
                    onClick={() => toggleCondition(condition)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                      isSelected
                        ? "bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white border-transparent shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#3B82F6]"
                    }`}
                  >
                    {condition}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Dark Mode + Save */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={onDarkModeChange}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border border-gray-200 shadow-lg hover:border-[#3B82F6] transition-all flex-1"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
              <span className="font-medium text-gray-700">
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </span>
            </button>

            <button
              onClick={save}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white shadow-lg hover:shadow-xl transition-all flex-1 font-semibold"
            >
              Save Profile
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
