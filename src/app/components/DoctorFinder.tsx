import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Heart, Calendar, X, Phone, ChevronRight, Loader2, Building2, ExternalLink, Navigation } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { toast } from "sonner";
import { generateDirectionsLink } from "../../utils/mapLinks";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useQuery } from "@tanstack/react-query";
import { fetchNearbyFacilities } from "../../services/overpass";
import { Facility } from "../../types/facility";

const AMENITY_GRADIENT: Record<string, string> = { hospital: "from-red-500 to-red-600", clinic: "from-[#3B82F6] to-[#6EE7D8]", doctors: "from-green-500 to-emerald-500", dentist: "from-purple-500 to-purple-600", pharmacy: "from-orange-500 to-amber-500", healthcare: "from-teal-500 to-cyan-500" };
const FILTERS: { label: string; amenity: string | null }[] = [
  { label: "All", amenity: null },
  { label: "Hospital", amenity: "hospital" },
  { label: "Clinic", amenity: "clinic" },
  { label: "Doctors", amenity: "doctors" },
  { label: "Dentist", amenity: "dentist" },
  { label: "Pharmacy", amenity: "pharmacy" },
];
const TIME_SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM"];

export function DoctorFinder() {
  const [filter, setFilter] = useState<string | null>(null); // null = All
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useLocalStorage<string[]>("ll_saved_doctors", []);
  const [savedSet, setSavedSet] = useState(new Set(saved));
  const [city, setCity] = useLocalStorage("ll_city", "");
  const [coords, setCoords] = useLocalStorage<{ lat: number; lng: number } | null>("ll_coords", null);
  const { coords: hookCoords, error: hookError, loading: locating, locate } = useGeolocation();

  const { data: facilities = [], isLoading: loading } = useQuery({
    queryKey: ["facilities", coords?.lat, coords?.lng],
    queryFn: () => fetchNearbyFacilities(coords!.lat, coords!.lng),
    enabled: !!coords,
  });

  const fetched = !!coords;

  const [bookTarget, setBookTarget] = useState<Facility | null>(null);
  const [bDate, setBDate] = useState(""), [bSlot, setBSlot] = useState(""), [bName, setBName] = useState(""), [bPhone, setBPhone] = useState("");
  const [profile, setProfile] = useState<Facility | null>(null);

  const detect = useCallback(() => {
    locate(2); // Attempt with 2 retries
  }, [locate]);

  useEffect(() => {
    if (hookCoords) {
      setCoords(hookCoords);
      // Fetch city
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${hookCoords.lat}&lon=${hookCoords.lng}&format=json`)
        .then(r => r.json())
        .then(d => {
          setCity(d.address?.city || d.address?.town || d.address?.village || "Your location");
        })
        .catch(() => setCity("Your location"));
      
      // The useQuery will automatically handle the fetchFacilities
    }
  }, [hookCoords, setCoords, setCity]);

  useEffect(() => {
    if (hookError) toast.error(hookError);
  }, [hookError]);

  const toggleSave = (id: string) => {
    const s = new Set(savedSet);
    s.has(id) ? (s.delete(id), toast.success("Removed from saved")) : (s.add(id), toast.success("Saved ❤️"));
    setSavedSet(s); setSaved(Array.from(s));
  };

  const confirmBook = () => {
    if (!bDate || !bSlot || !bName) { toast.error("Fill all required fields"); return; }
    const apts = JSON.parse(localStorage.getItem("ll_appointments") || "[]");
    apts.push({ doctor: bookTarget?.name, specialization: bookTarget?.specialization, address: bookTarget?.address, date: bDate, slot: bSlot, patient: bName, phone: bPhone, bookedAt: new Date().toISOString() });
    localStorage.setItem("ll_appointments", JSON.stringify(apts));
    toast.success("Appointment booked! ✓", { description: `${bookTarget?.name} · ${bDate} at ${bSlot}` });
    setBookTarget(null); setBDate(""); setBSlot(""); setBName(""); setBPhone("");
  };

  const filtered = facilities.filter(f => {
    if (filter !== null && f.amenity !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!f.name.toLowerCase().includes(q) && !f.specialization.toLowerCase().includes(q) && !f.address.toLowerCase().includes(q)) return false;
    }
    return true;
  });
  const today = new Date().toISOString().split("T")[0];
  const initials = (name: string) => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  return (
    <div className="py-8 px-4 min-h-full bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] bg-clip-text text-transparent">Find Nearby Healthcare</motion.h2>
          <p className="text-gray-500 dark:text-gray-400">Discover verified hospitals & clinics in your area</p>
        </div>

        {/* Search + Location */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, type, or address…" className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all" />
            {query && <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-[#3B82F6]" />
            <span>{locating ? "Detecting…" : city || "No location set"}</span>
            <button onClick={detect} disabled={locating} className="text-[#3B82F6] hover:underline ml-1 disabled:opacity-50 flex items-center gap-1">
              <Navigation className="w-3 h-3" />{locating ? "Locating…" : city ? "Refresh" : "Detect my location"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {FILTERS.map(f => (
            <button key={f.label} onClick={() => setFilter(f.amenity)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === f.amenity ? "bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white shadow-md" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-[#3B82F6]"}`}>{f.label}</button>
          ))}
        </div>

        {/* Empty state — no location yet */}
        {!fetched && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find Real Nearby Facilities</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Tap below to detect your location and see real hospitals, clinics, and doctors near you.</p>
            <button onClick={detect} className="px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto">
              <Navigation className="w-5 h-5" /> Detect My Location
            </button>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Fetching verified facilities nearby…</p>
          </div>
        )}

        {/* Results */}
        {!loading && fetched && filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10">No results found{query ? ` for "${query}"` : ""}.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }} className="group">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Top accent */}
                <div className={`h-1 bg-gradient-to-r ${AMENITY_GRADIENT[f.amenity] || "from-[#3B82F6] to-[#6EE7D8]"}`} />
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${AMENITY_GRADIENT[f.amenity] || "from-[#3B82F6] to-[#6EE7D8]"} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow`}>
                      {initials(f.name) || <Building2 className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-0.5 line-clamp-2">{f.name}</h3>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-[#3B82F6]">{f.specialization}</span>
                    </div>
                    <button onClick={() => toggleSave(f.id)} className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:border-red-300 transition-all">
                      <Heart className={`w-4 h-4 ${savedSet.has(f.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    </button>
                  </div>

                  {/* Address */}
                  {f.address !== "Address unavailable" && (
                    <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
                      <span className="line-clamp-2">{f.address}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-[#3B82F6]">{f.distance} km away</span>
                    {f.phone && <a href={`tel:${f.phone}`} className="flex items-center gap-1 hover:text-[#3B82F6] transition-colors"><Phone className="w-3 h-3" />{f.phone}</a>}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setBookTarget(f)} className="flex-1 px-3 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white rounded-xl text-sm font-medium hover:shadow-md transition-all flex items-center justify-center gap-1.5">
                      <Calendar className="w-4 h-4" /> Book
                    </button>
                    <a href={generateDirectionsLink(f.lat, f.lng)} target="_blank" rel="noreferrer" className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all flex items-center gap-1.5">
                      <Navigation className="w-4 h-4" /> Directions
                    </a>
                    {f.website && (
                      <a href={f.website.startsWith("http") ? f.website : `https://${f.website}`} target="_blank" rel="noreferrer" className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm hover:border-[#3B82F6] transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setBookTarget(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] p-6 text-white">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold">Book Appointment</h2>
                  <button onClick={() => setBookTarget(null)}><X className="w-5 h-5 text-white/80" /></button>
                </div>
                <p className="text-blue-100 text-sm line-clamp-1">{bookTarget.name}</p>
                {bookTarget.address !== "Address unavailable" && <p className="text-blue-100 text-xs mt-0.5 line-clamp-1">{bookTarget.address}</p>}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
                  <input type="text" value={bName} onChange={e => setBName(e.target.value)} placeholder="Full name" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input type="tel" value={bPhone} onChange={e => setBPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                  <input type="date" value={bDate} min={today} onChange={e => setBDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Slot *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button key={slot} onClick={() => setBSlot(slot)} className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${bSlot === slot ? "bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white shadow" : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#3B82F6]"}`}>{slot}</button>
                    ))}
                  </div>
                </div>
                <button onClick={confirmBook} className="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Confirm Booking <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
