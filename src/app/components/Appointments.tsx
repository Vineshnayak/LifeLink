import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, MapPin, Phone, Trash2, Edit3, X, ChevronRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Appointment {
  doctor: string;
  specialization: string;
  address: string;
  date: string;
  slot: string;
  patient: string;
  phone: string;
  bookedAt: string;
}

const TIME_SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM"];
const today = new Date().toISOString().split("T")[0];

function getAppointments(): Appointment[] {
  try { return JSON.parse(localStorage.getItem("ll_appointments") || "[]"); } catch { return []; }
}
function saveAppointments(list: Appointment[]) {
  localStorage.setItem("ll_appointments", JSON.stringify(list));
}

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [eDate, setEDate] = useState("");
  const [eSlot, setESlot] = useState("");

  const upcoming = appointments.filter(a => a.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = appointments.filter(a => a.date < today).sort((a, b) => b.date.localeCompare(a.date));

  const openEdit = (idx: number) => {
    const a = appointments[idx];
    setEDate(a.date);
    setESlot(a.slot);
    setEditIdx(idx);
  };

  const confirmEdit = () => {
    if (!eDate || !eSlot) { toast.error("Select date and time"); return; }
    const updated = [...appointments];
    updated[editIdx!] = { ...updated[editIdx!], date: eDate, slot: eSlot };
    saveAppointments(updated);
    setAppointments(updated);
    setEditIdx(null);
    toast.success("Appointment rescheduled!");
  };

  const confirmDelete = () => {
    const updated = appointments.filter((_, i) => i !== deleteIdx);
    saveAppointments(updated);
    setAppointments(updated);
    setDeleteIdx(null);
    toast.success("Appointment cancelled");
  };

  const Card = ({ apt, idx }: { apt: Appointment; idx: number }) => {
    const isPast = apt.date < today;
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#6EE7D8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {apt.doctor?.split(" ").pop()?.[0] ?? "D"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{apt.doctor}</p>
              <p className="text-xs text-[#3B82F6]">{apt.specialization}</p>
              {apt.address && apt.address !== "Address unavailable" && (
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" /><span className="truncate">{apt.address}</span>
                </div>
              )}
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <Calendar className="w-3 h-3 text-[#3B82F6]" />{apt.date}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <Clock className="w-3 h-3 text-[#3B82F6]" />{apt.slot}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span>Patient: {apt.patient}</span>
                {apt.phone && <><Phone className="w-3 h-3" /><a href={`tel:${apt.phone}`} className="hover:text-[#3B82F6]">{apt.phone}</a></>}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            {isPast ? (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">Past</span>
            ) : (
              <span className="text-xs px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />Upcoming
              </span>
            )}
            {!isPast && (
              <button onClick={() => openEdit(idx)} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#3B82F6] hover:text-[#3B82F6] text-gray-400 transition-all">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setDeleteIdx(idx)} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-400 hover:text-red-500 text-gray-400 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="py-8 px-4 min-h-full bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] bg-clip-text text-transparent">
          My Appointments
        </motion.h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Manage, reschedule, or cancel your bookings.</p>

        {appointments.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No appointments yet. Book from the Doctors tab.</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Upcoming ({upcoming.length})</h3>
                <div className="space-y-3">
                  {upcoming.map((apt, i) => <Card key={`u-${i}`} apt={apt} idx={appointments.indexOf(apt)} />)}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Past ({past.length})</h3>
                <div className="space-y-3">
                  {past.map((apt, i) => <Card key={`p-${i}`} apt={apt} idx={appointments.indexOf(apt)} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editIdx !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditIdx(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] p-5 text-white flex justify-between items-center">
                <h2 className="text-lg font-bold">Reschedule Appointment</h2>
                <button onClick={() => setEditIdx(null)}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Date *</label>
                  <input type="date" value={eDate} min={today} onChange={e => setEDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Time Slot *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button key={slot} onClick={() => setESlot(slot)}
                        className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${eSlot === slot ? "bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white shadow" : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#3B82F6]"}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={confirmEdit}
                  className="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#6EE7D8] text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Confirm Reschedule <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteIdx !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteIdx(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Cancel Appointment?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This will permanently remove the booking for <strong>{appointments[deleteIdx!]?.doctor}</strong>.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteIdx(null)}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-400 transition-all">
                  Keep it
                </button>
                <button onClick={confirmDelete}
                  className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all">
                  Cancel Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
