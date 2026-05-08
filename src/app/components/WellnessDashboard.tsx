import { motion, AnimatePresence } from "motion/react";
import {
  Apple,
  Droplets,
  Activity,
  Moon,
  Coffee,
  Dumbbell,
  Plus,
  Minus,
  X,
  ExternalLink,
} from "lucide-react";
import { useState, useCallback } from "react";
import * as Progress from "@radix-ui/react-progress";
import { useLocalStorage, todayKey } from "../hooks/useLocalStorage";
import { toast } from "sonner";

interface MealCard {
  id: string;
  title: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: string[];
  recipeQuery: string;
}

const mealData: MealCard[] = [
  {
    id: "breakfast",
    title: "Breakfast",
    time: "8:00 AM",
    calories: 420,
    protein: 25,
    carbs: 45,
    fat: 12,
    items: ["Oatmeal with berries", "Greek yogurt", "Almonds", "Green tea"],
    recipeQuery: "healthy+breakfast+oatmeal+berries+recipe",
  },
  {
    id: "lunch",
    title: "Lunch",
    time: "1:00 PM",
    calories: 550,
    protein: 35,
    carbs: 55,
    fat: 18,
    items: ["Grilled chicken salad", "Quinoa", "Avocado", "Olive oil dressing"],
    recipeQuery: "grilled+chicken+salad+quinoa+healthy+recipe",
  },
  {
    id: "dinner",
    title: "Dinner",
    time: "7:00 PM",
    calories: 480,
    protein: 40,
    carbs: 35,
    fat: 15,
    items: ["Baked salmon", "Steamed broccoli", "Sweet potato", "Mixed greens"],
    recipeQuery: "baked+salmon+broccoli+sweet+potato+recipe",
  },
  {
    id: "snacks",
    title: "Healthy Snacks",
    time: "Throughout day",
    calories: 200,
    protein: 8,
    carbs: 25,
    fat: 9,
    items: ["Apple slices", "Hummus", "Carrots", "Dark chocolate (1 oz)"],
    recipeQuery: "healthy+snack+hummus+apple+recipe",
  },
];

interface HabitState {
  water: number;
  sleep: number;
  exercise: number;
  steps: number;
  date: string;
}

const habitTargets = { water: 8, sleep: 8, exercise: 45, steps: 10000 };
const habitSteps = { water: 1, sleep: 1, exercise: 5, steps: 500 };
const habitUnits = { water: "glasses", sleep: "hrs", exercise: "mins", steps: "steps" };

const defaultHabits: HabitState = {
  water: 0,
  sleep: 0,
  exercise: 0,
  steps: 0,
  date: todayKey(),
};

export function WellnessDashboard() {
  const [bmi, setBmi] = useLocalStorage("ll_bmi", { weight: 70, height: 170 });
  const [savedBMI, setSavedBMI] = useLocalStorage<number | null>("ll_saved_bmi", null);

  // Daily-reset habits
  const [rawHabits, setRawHabits] = useLocalStorage<HabitState>("ll_habits", defaultHabits);
  const habits = rawHabits.date === todayKey() ? rawHabits : { ...defaultHabits, date: todayKey() };

  const [recipeModal, setRecipeModal] = useState<MealCard | null>(null);

  const updateHabit = useCallback(
    (key: keyof typeof habitTargets, delta: number) => {
      const target = habitTargets[key];
      const step = habitSteps[key];
      const current = habits[key];
      const next = Math.max(0, Math.min(target, current + delta * step));
      const updated = { ...habits, [key]: next, date: todayKey() };
      setRawHabits(updated);
      if (delta > 0) {
        if (next === target) {
          toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} goal reached! 🎉`);
        } else {
          toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} logged ✓`);
        }
      }
    },
    [habits, setRawHabits]
  );

  const logWater = () => updateHabit("water", 1);

  const calculateBMI = () => {
    const h = bmi.height / 100;
    return (bmi.weight / (h * h)).toFixed(1);
  };

  const getBMICategory = (v: number) => {
    if (v < 18.5) return { category: "Underweight", color: "text-blue-600", advice: "Consider increasing caloric intake with nutrient-dense foods." };
    if (v < 25) return { category: "Normal", color: "text-green-600", advice: "Great! Maintain your current diet and exercise routine." };
    if (v < 30) return { category: "Overweight", color: "text-orange-600", advice: "Consider a balanced diet and 30 mins of daily exercise." };
    return { category: "Obese", color: "text-red-600", advice: "Please consult a healthcare professional for a personalized plan." };
  };

  const bmiValue = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmiValue);

  const saveBMI = () => {
    setSavedBMI(bmiValue);
    toast.success("BMI saved!", { description: `${bmiValue} — ${bmiInfo.category}` });
  };

  const habitList = [
    { id: "water" as const, icon: Droplets, label: "Water Intake" },
    { id: "sleep" as const, icon: Moon, label: "Sleep" },
    { id: "exercise" as const, icon: Dumbbell, label: "Exercise" },
    { id: "steps" as const, icon: Activity, label: "Steps" },
  ];

  return (
    <div className="py-8 px-4 min-h-full bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] bg-clip-text text-transparent">
            Wellness Dashboard
          </h2>
          <p className="text-lg text-gray-600">
            Track your health goals and personalized recommendations
          </p>
        </motion.div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Hydration Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 to-[#6EE7D8]/10 border border-[#3B82F6]/20 dark:border-[#3B82F6]/30 backdrop-blur-sm h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Hydration</h3>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Circular progress */}
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-200" />
                  <circle
                    cx="80" cy="80" r="70"
                    stroke="url(#wGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(habits.water / 8) * 440} 440`}
                    className="transition-all duration-500"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="wGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#6EE7D8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">{habits.water}/8</span>
                  <span className="text-sm text-gray-600">glasses</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Daily target: 8 glasses</p>
                <button
                  onClick={logWater}
                  disabled={habits.water >= 8}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {habits.water >= 8 ? "Goal Reached 🎉" : "Log Water +"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* BMI Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">BMI Calculator</h3>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6EE7D8] to-green-500 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Weight (kg): {bmi.weight}</label>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={bmi.weight}
                    onChange={(e) => setBmi({ ...bmi, weight: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Height (cm): {bmi.height}</label>
                  <input
                    type="range"
                    min="140"
                    max="220"
                    value={bmi.height}
                    onChange={(e) => setBmi({ ...bmi, height: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 mb-3">
                <div className="text-4xl font-bold text-gray-900 mb-1">{calculateBMI()}</div>
                <div className={`text-lg font-semibold ${bmiInfo.color} mb-1`}>{bmiInfo.category}</div>
                <p className="text-xs text-gray-500">{bmiInfo.advice}</p>
              </div>

              <button
                onClick={saveBMI}
                className="w-full px-4 py-2 border border-[#3B82F6] text-[#3B82F6] rounded-xl font-medium hover:bg-[#3B82F6] hover:text-white transition-all"
              >
                {savedBMI ? `Last saved: ${savedBMI}` : "Save BMI"}
              </button>
            </div>
          </motion.div>

          {/* Habit Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Daily Habits</h3>
                <Coffee className="w-6 h-6 text-[#3B82F6]" />
              </div>

              <div className="space-y-5">
                {habitList.map(({ id, icon: Icon, label }) => {
                  const current = habits[id];
                  const target = habitTargets[id];
                  const percentage = Math.min(100, (current / target) * 100);
                  return (
                    <div key={id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateHabit(id, -1)}
                            disabled={current === 0}
                            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition-all"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="text-sm text-gray-600 min-w-[60px] text-center">
                            {current}/{target} {habitUnits[id]}
                          </span>
                          <button
                            onClick={() => updateHabit(id, 1)}
                            disabled={current >= target}
                            className="w-6 h-6 rounded-full bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 disabled:opacity-40 flex items-center justify-center transition-all"
                          >
                            <Plus className="w-3 h-3 text-[#3B82F6]" />
                          </button>
                        </div>
                      </div>
                      <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full h-2" value={percentage}>
                        <Progress.Indicator
                          className="bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] h-full transition-transform duration-500 ease-out"
                          style={{ transform: `translateX(-${100 - percentage}%)` }}
                        />
                      </Progress.Root>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Meal Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Apple className="w-7 h-7 text-[#3B82F6]" />
            Personalized Meal Plan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mealData.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900">{meal.title}</h4>
                    <span className="text-xs text-gray-500">{meal.time}</span>
                  </div>
                  <div className="text-2xl font-bold text-[#3B82F6]">
                    {meal.calories} <span className="text-sm text-gray-500">kcal</span>
                  </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-blue-50">
                    <div className="text-sm font-bold text-blue-700">{meal.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-orange-50">
                    <div className="text-sm font-bold text-orange-700">{meal.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-green-50">
                    <div className="text-sm font-bold text-green-700">{meal.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                </div>

                {/* Items */}
                <ul className="space-y-1 mb-4">
                  {meal.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[#6EE7D8] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setRecipeModal(meal)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                >
                  View Recipe
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {recipeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setRecipeModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{recipeModal.title}</h2>
                  <button onClick={() => setRecipeModal(null)}>
                    <X className="w-5 h-5 text-white/80" />
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-1">{recipeModal.calories} kcal · {recipeModal.time}</p>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                <ul className="space-y-2 mb-6">
                  {recipeModal.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-[#6EE7D8] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="text-center p-2 rounded-lg bg-blue-50">
                    <div className="text-sm font-bold text-blue-700">{recipeModal.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-orange-50">
                    <div className="text-sm font-bold text-orange-700">{recipeModal.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-green-50">
                    <div className="text-sm font-bold text-green-700">{recipeModal.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/search?q=${recipeModal.recipeQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white rounded-xl font-medium text-center hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Find Full Recipe
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
