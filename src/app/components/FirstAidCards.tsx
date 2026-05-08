import { motion, AnimatePresence } from "motion/react";
import {
  Scissors,
  Flame,
  BoneIcon,
  HeartPulse,
  Thermometer,
  UtensilsCrossed,
  ChevronDown,
  Search,
  Phone,
  Share2,
  X,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";
import { toast } from "sonner";

interface FirstAidItem {
  id: string;
  icon: any;
  title: string;
  severity: "mild" | "moderate" | "critical";
  urgency: string;
  preview: string;
  steps: string[];
  doNots: string[];
  videoQuery: string;
}

const firstAidData: FirstAidItem[] = [
  {
    id: "cuts",
    icon: Scissors,
    title: "Cuts & Scrapes",
    severity: "mild",
    urgency: "Within 30 minutes",
    preview: "Clean wound, apply pressure, and bandage",
    steps: [
      "Wash your hands thoroughly with soap and water",
      "Clean the wound with running water",
      "Apply gentle pressure with clean cloth to stop bleeding",
      "Apply antibiotic ointment",
      "Cover with sterile bandage",
      "Change bandage daily and watch for infection",
    ],
    doNots: ["Don't use iodine or hydrogen peroxide directly", "Don't remove deeply embedded objects"],
    videoQuery: "first+aid+cuts+and+scrapes",
  },
  {
    id: "burns",
    icon: Flame,
    title: "Burns",
    severity: "moderate",
    urgency: "Immediate",
    preview: "Cool the burn, cover with clean cloth",
    steps: [
      "Remove from heat source immediately",
      "Cool the burn with cool (not cold) running water for 10–20 minutes",
      "Remove jewelry or tight items before swelling",
      "Do NOT break blisters",
      "Apply a clean, dry dressing",
      "Take over-the-counter pain reliever if needed",
      "Seek medical help for severe burns",
    ],
    doNots: ["Don't apply butter or toothpaste", "Don't use ice — it damages tissue"],
    videoQuery: "first+aid+burn+treatment",
  },
  {
    id: "fractures",
    icon: BoneIcon,
    title: "Fractures",
    severity: "critical",
    urgency: "Immediate - Call 112",
    preview: "Immobilize the area, seek emergency care",
    steps: [
      "Call emergency services immediately",
      "Do NOT move the injured area",
      "Apply ice packs to reduce swelling",
      "Immobilize the injury with a splint if trained",
      "Elevate the injured area if possible",
      "Monitor for shock symptoms",
      "Do NOT try to realign the bone",
    ],
    doNots: ["Don't move the patient unless in danger", "Don't attempt to straighten the limb"],
    videoQuery: "first+aid+bone+fracture",
  },
  {
    id: "cpr",
    icon: HeartPulse,
    title: "CPR",
    severity: "critical",
    urgency: "Immediate - Life Threatening",
    preview: "Chest compressions and rescue breaths",
    steps: [
      "Call 112 immediately",
      "Check if person is responsive and breathing",
      "Place person on firm, flat surface",
      "Position hands on center of chest",
      "Push hard and fast — 100–120 compressions per minute",
      "Allow chest to fully recoil between compressions",
      "Give 2 rescue breaths after every 30 compressions",
      "Continue until help arrives",
    ],
    doNots: ["Don't stop compressions unless the person revives", "Don't give rescue breaths if untrained — do hands-only CPR"],
    videoQuery: "how+to+perform+CPR+first+aid",
  },
  {
    id: "fever",
    icon: Thermometer,
    title: "Fever",
    severity: "mild",
    urgency: "Monitor symptoms",
    preview: "Rest, hydrate, and monitor temperature",
    steps: [
      "Take temperature to confirm fever (>100.4°F / 38°C)",
      "Rest and avoid strenuous activity",
      "Drink plenty of fluids",
      "Take fever-reducing medication as directed",
      "Use cool compress on forehead",
      "Wear light clothing",
      "Seek medical help if fever exceeds 103°F or lasts >3 days",
    ],
    doNots: ["Don't give aspirin to children", "Don't bundle in heavy blankets"],
    videoQuery: "how+to+treat+fever+at+home",
  },
  {
    id: "food-poisoning",
    icon: UtensilsCrossed,
    title: "Food Poisoning",
    severity: "moderate",
    urgency: "Within a few hours",
    preview: "Stay hydrated and rest",
    steps: [
      "Stop eating solid foods temporarily",
      "Drink clear liquids (water, broth, electrolyte drinks)",
      "Avoid caffeine and alcohol",
      "Gradually reintroduce bland foods (BRAT diet)",
      "Rest and avoid strenuous activity",
      "Monitor for severe symptoms (high fever, bloody stool)",
      "Seek medical help if symptoms worsen or persist >3 days",
    ],
    doNots: ["Don't force vomiting unless instructed by a doctor", "Don't take anti-diarrheal drugs without medical advice"],
    videoQuery: "food+poisoning+first+aid+treatment",
  },
];

const severityColors = {
  mild: "from-green-500 to-emerald-500",
  moderate: "from-orange-500 to-amber-500",
  critical: "from-red-600 to-red-500",
};

const severityBadgeColors = {
  mild: "bg-green-100 text-green-700 border-green-200",
  moderate: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

export function FirstAidCards() {
  const [query, setQuery] = useState("");
  const [modalItem, setModalItem] = useState<FirstAidItem | null>(null);

  const filtered = firstAidData.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.preview.toLowerCase().includes(query.toLowerCase())
  );

  const handleShare = async (item: FirstAidItem) => {
    const text = `LifeLink First Aid: ${item.title}\n\n${item.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `First Aid: ${item.title}`, text });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!", { description: "Share it with someone who needs it." });
    }
  };

  return (
    <div className="py-8 px-4 min-h-full bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] bg-clip-text text-transparent"
          >
            Quick First Aid Assistance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Get immediate help for common medical emergencies
          </motion.p>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-xl mx-auto mb-10"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search first aid (e.g. burns, CPR…)"
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </motion.div>

        {/* No results */}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-10">No results for "{query}"</p>
        )}

        {/* Accordion Cards */}
        <Accordion.Root type="single" collapsible className="space-y-4">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
            >
              <Accordion.Item value={item.id}>
                <Accordion.Trigger className="group w-full">
                  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${severityColors[item.severity]}`} />
                    <div className="p-6 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${severityColors[item.severity]} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.preview}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${severityBadgeColors[item.severity]}`}>
                            {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {item.urgency}
                          </span>
                        </div>
                      </div>
                      <ChevronDown className="w-6 h-6 text-gray-400 group-data-[state=open]:rotate-180 transition-transform duration-300 flex-shrink-0" />
                    </div>
                  </div>
                </Accordion.Trigger>

                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="mt-2 p-6 rounded-2xl bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/50 shadow-md">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
                      Step-by-Step Instructions
                    </h4>
                    <ol className="space-y-3 mb-6">
                      {item.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {stepIndex + 1}
                          </span>
                          <span className="text-gray-700 flex-1">{step}</span>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => setModalItem(item)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                      >
                        Learn More
                      </button>
                      <button
                        onClick={() => handleShare(item)}
                        className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      {item.severity === "critical" && (
                        <a
                          href="tel:112"
                          className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors text-center flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Call 112
                        </a>
                      )}
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>
      </div>

      {/* Learn More Modal */}
      <AnimatePresence>
        {modalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className={`bg-gradient-to-r ${severityColors[modalItem.severity]} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <modalItem.icon className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">{modalItem.title}</h2>
                  </div>
                  <button onClick={() => setModalItem(null)}>
                    <X className="w-6 h-6 text-white/80 hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 space-y-6">
                {/* Steps */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">What To Do</h3>
                  <ol className="space-y-2">
                    {modalItem.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Do NOTs */}
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <h3 className="font-bold text-red-700 mb-3">⚠️ Do NOT</h3>
                  <ul className="space-y-1">
                    {modalItem.doNots.map((dn, i) => (
                      <li key={i} className="text-sm text-red-600 flex gap-2">
                        <span>•</span>
                        {dn}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://www.youtube.com/results?search_query=${modalItem.videoQuery}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white rounded-xl font-medium text-center hover:shadow-lg transition-all"
                  >
                    Watch Video Tutorial
                  </a>
                  <button
                    onClick={() => handleShare(modalItem)}
                    className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-[#3B82F6] transition-all flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Guide
                  </button>
                  {modalItem.severity === "critical" && (
                    <a
                      href="tel:112"
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium text-center hover:bg-red-700 transition-colors"
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Call 112
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
