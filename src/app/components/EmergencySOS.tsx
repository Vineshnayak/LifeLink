import { motion, AnimatePresence } from "motion/react";
import { Phone, X, MapPin, AlertTriangle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useGeolocation } from "../../hooks/useGeolocation";
import { generateDirectionsLink } from "../../utils/mapLinks";

export function EmergencySOS() {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [locationText, setLocationText] = useState<string | null>(null);
  const { coords, error, loading: locating, locate, setState: setGeoState } = useGeolocation();

  // Fetch geolocation when modal opens
  useEffect(() => {
    if (!showModal) return;
    locate(3); // 3 retries
  }, [showModal, locate]);

  useEffect(() => {
    if (coords) {
      setLocationText(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
    } else if (error) {
      setLocationText("Location unavailable");
    }
  }, [coords, error]);


  // Countdown timer
  useEffect(() => {
    if (!showModal) {
      setCountdown(3);
      return;
    }
    if (countdown === 0) {
      window.location.href = "tel:112";
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showModal, countdown]);

  const cancel = useCallback(() => {
    setShowModal(false);
    setCountdown(3);
    setLocationText(null);
    setGeoState({ coords: null, error: null, loading: false });
  }, [setGeoState]);

  // Load emergency contact from profile
  const getEmergencyContact = () => {
    try {
      const profile = JSON.parse(localStorage.getItem("ll_profile") || "{}");
      return profile.emergencyName && profile.emergencyPhone
        ? `${profile.emergencyName}: ${profile.emergencyPhone}`
        : null;
    } catch {
      return null;
    }
  };
  const emergencyContact = getEmergencyContact();

  return (
    <>
      {/* Floating SOS Button */}
      <motion.div
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.button
          id="sos-btn"
          onClick={() => setShowModal(true)}
          whileTap={{ scale: 0.9 }}
          className="group relative"
          aria-label="Emergency SOS"
        >
          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          {/* Main button */}
          <motion.div
            className="relative w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(239,68,68,0.5)",
                "0 0 40px rgba(239,68,68,0.8)",
                "0 0 20px rgba(239,68,68,0.5)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Phone className="w-8 h-8 text-white" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* SOS Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Red Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-white text-center">
                <div className="flex justify-end mb-2">
                  <button onClick={cancel} className="text-white/80 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <AlertTriangle className="w-16 h-16 mx-auto mb-3 animate-pulse" />
                <h2 className="text-2xl font-bold mb-1">Emergency SOS</h2>
                <p className="text-red-100 text-sm">Calling emergency services in</p>
              </div>

              {/* Countdown */}
              <div className="p-6 text-center">
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-8xl font-black text-red-600 mb-6"
                >
                  {countdown}
                </motion.div>

                {/* Location */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 text-[#3B82F6]" />
                  {locating ? (
                    <span className="animate-pulse">Getting your location…</span>
                  ) : (
                    <span>
                      {locationText ?? "Location unavailable"}
                      {coords && (
                        <a
                          href={generateDirectionsLink(coords.lat, coords.lng)}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-[#3B82F6] underline"
                        >
                          View map
                        </a>
                      )}
                    </span>
                  )}
                </div>

                {/* Emergency contact */}
                {emergencyContact && (
                  <div className="bg-red-50 rounded-xl px-4 py-3 mb-6 text-sm text-gray-700">
                    <span className="font-medium text-red-600">Emergency Contact: </span>
                    {emergencyContact}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={cancel}
                    className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-red-300 transition-all"
                  >
                    Cancel
                  </button>
                  <a
                    href="tel:112"
                    className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-semibold text-center hover:bg-red-700 transition-all"
                    onClick={cancel}
                  >
                    Call Now (112)
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
