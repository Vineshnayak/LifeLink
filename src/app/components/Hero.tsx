import { motion } from "motion/react";
import { Heart, Stethoscope, Apple, AlertCircle } from "lucide-react";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export function Hero() {
  const ctaButtons = [
    {
      icon: AlertCircle,
      label: "Get First Aid Help",
      gradient: "from-red-500 to-orange-500",
      id: "first-aid",
    },
    {
      icon: Stethoscope,
      label: "Find Nearby Doctors",
      gradient: "from-[#3B82F6] to-[#6EE7D8]",
      id: "doctors",
    },
    {
      icon: Apple,
      label: "Diet Recommendations",
      gradient: "from-[#6EE7D8] to-green-500",
      id: "wellness",
    },
    {
      icon: Heart,
      label: "Emergency SOS",
      gradient: "from-red-600 to-red-500",
      id: "sos-trigger",
    },
  ];

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6EE7D8]/10 via-[#3B82F6]/5 to-purple-500/10" />

      {/* Floating orbs for depth */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-[#6EE7D8]/20 to-transparent rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#3B82F6]/20 to-transparent rounded-full blur-3xl"
        animate={{ y: [0, -40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/20"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] bg-clip-text text-transparent">
            LifeLink
          </span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#111827] via-[#3B82F6] to-[#6EE7D8] bg-clip-text text-transparent leading-tight"
        >
          Smart Healthcare
          <br />
          Assistance Anytime
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          AI-powered first aid guidance, nearby doctor discovery, emergency support,
          and wellness tracking in one seamless healthcare platform.
        </motion.p>

        {/* CTA Buttons Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {ctaButtons.map((button, index) => (
            <motion.button
              key={button.id}
              onClick={() => {
                if (button.id === "sos-trigger") {
                  document.getElementById("sos-btn")?.click();
                } else {
                  scrollTo(button.id);
                }
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative px-6 py-4 rounded-2xl bg-gradient-to-r ${button.gradient} text-white shadow-lg overflow-hidden transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="relative flex flex-col items-center gap-3">
                <button.icon className="w-8 h-8" />
                <span className="font-medium">{button.label}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Stats / trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>24/7 Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse" />
            <span>Works Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#6EE7D8] rounded-full animate-pulse" />
            <span>Private &amp; Secure</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
