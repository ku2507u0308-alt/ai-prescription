import { useState, useEffect } from "react";
import { Prescription, MedicineReminder } from "../App";
import { ArrowLeft, Bell, Clock, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface RemindersScreenProps {
  prescription: Prescription | null;
  onBack: () => void;
}

export function RemindersScreen({ prescription, onBack }: RemindersScreenProps) {
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [reminderTimes, setReminderTimes] = useState<Record<string, string[]>>({});
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    if (prescription) {
      // Load existing reminders
      const savedReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
      const prescriptionReminders = savedReminders.filter(
        (r: MedicineReminder) => r.prescriptionId === prescription.id
      );
      
      if (prescriptionReminders.length > 0) {
        setReminders(prescriptionReminders);
        setIsSetup(true);
      } else {
        // Initialize reminder times based on dose
        const times: Record<string, string[]> = {};
        prescription.medicines.forEach((med) => {
          const [morning, afternoon, evening] = med.dose.split("-").map(Number);
          const medTimes: string[] = [];
          if (morning > 0) medTimes.push("08:00");
          if (afternoon > 0) medTimes.push("13:00");
          if (evening > 0) medTimes.push("20:00");
          times[med.id] = medTimes;
        });
        setReminderTimes(times);
      }
    }
  }, [prescription]);

  const handleTimeChange = (medicineId: string, index: number, time: string) => {
    setReminderTimes({
      ...reminderTimes,
      [medicineId]: reminderTimes[medicineId].map((t, i) => (i === index ? time : t)),
    });
  };

  const handleSetupReminders = () => {
    if (!prescription) return;

    const newReminders: MedicineReminder[] = [];
    const today = new Date().toISOString().split("T")[0];

    prescription.medicines.forEach((med) => {
      const times = reminderTimes[med.id] || [];
      times.forEach((time) => {
        newReminders.push({
          prescriptionId: prescription.id,
          medicineId: med.id,
          medicineName: med.name,
          dose: med.dose,
          time: time,
          status: "pending",
          date: today,
        });
      });
    });

    // Save reminders
    const allReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    const updatedReminders = [...allReminders, ...newReminders];
    localStorage.setItem("reminders", JSON.stringify(updatedReminders));

    setReminders(newReminders);
    setIsSetup(true);
    toast.success("Reminders set up successfully!");
  };

  const handleReminderAction = (reminder: MedicineReminder, action: "taken" | "delayed") => {
    const updatedReminders = reminders.map((r) =>
      r.medicineId === reminder.medicineId && r.time === reminder.time
        ? { ...r, status: action }
        : r
    );

    // Update in state
    setReminders(updatedReminders);

    // Update in localStorage
    const allReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    const otherReminders = allReminders.filter(
      (r: MedicineReminder) => r.prescriptionId !== prescription?.id
    );
    localStorage.setItem("reminders", JSON.stringify([...otherReminders, ...updatedReminders]));

    if (action === "taken") {
      toast.success(`Marked ${reminder.medicineName} as taken`);
    } else {
      toast.info(`${reminder.medicineName} delayed by 1 hour`);
    }
  };

  if (!prescription) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 text-center">
            <p className="text-gray-600">No prescription selected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 animate-slide-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Medication Reminders</h2>
              <p className="text-gray-600 text-sm">Set up and track your medicine schedule</p>
            </div>
          </div>

          {!isSetup ? (
            // Setup Mode
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Set reminder times</span> for each medicine based on your dose schedule.
                </p>
              </div>

              {prescription.medicines.map((medicine) => {
                const [morning, afternoon, evening] = medicine.dose.split("-").map(Number);
                const times = reminderTimes[medicine.id] || [];

                return (
                  <div key={medicine.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5 border-2 border-yellow-200">
                    <h3 className="font-bold text-gray-800 mb-3">{medicine.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">Dose: {medicine.dose} ({medicine.days} days)</p>

                    <div className="space-y-3">
                      {times.map((time, index) => {
                        const label = index === 0 ? "Morning" : index === 1 && times.length === 3 ? "Afternoon" : "Evening";
                        return (
                          <div key={index} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-yellow-300">
                            <Clock className="w-5 h-5 text-yellow-600" />
                            <span className="text-sm font-semibold text-gray-700 w-20">{label}</span>
                            <input
                              type="time"
                              value={time}
                              onChange={(e) => handleTimeChange(medicine.id, index, e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={handleSetupReminders}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                Start Reminders
              </button>
            </div>
          ) : (
            // Active Reminders Mode
            <div className="space-y-6">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-700 font-medium">
                  Reminders are active! Track your medicine intake below.
                </p>
              </div>

              {/* Group reminders by medicine */}
              {prescription.medicines.map((medicine) => {
                const medicineReminders = reminders.filter((r) => r.medicineId === medicine.id);

                return (
                  <div key={medicine.id} className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-5 border-2 border-blue-200">
                    <h3 className="font-bold text-gray-800 mb-1">{medicine.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">Dose: {medicine.dose}</p>

                    <div className="space-y-3">
                      {medicineReminders.map((reminder, index) => (
                        <div
                          key={index}
                          className={`bg-white rounded-xl p-4 border-2 ${
                            reminder.status === "taken"
                              ? "border-green-300 bg-green-50"
                              : reminder.status === "delayed"
                              ? "border-orange-300 bg-orange-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="font-semibold text-gray-800">{reminder.time}</span>
                            </div>
                            {reminder.status === "taken" && (
                              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">
                                ✓ Taken
                              </span>
                            )}
                            {reminder.status === "delayed" && (
                              <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-bold">
                                ⏱ Delayed
                              </span>
                            )}
                          </div>

                          {reminder.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReminderAction(reminder, "taken")}
                                className="flex-1 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Taken
                              </button>
                              <button
                                onClick={() => handleReminderAction(reminder, "delayed")}
                                className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                              >
                                <Clock className="w-4 h-4" />
                                Delay 1h
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
                <p className="text-xs text-gray-600 text-center">
                  💡 Tip: Mark medicines as "Taken" or "Delay" to track your adherence. View detailed stats in the Analysis tab.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
