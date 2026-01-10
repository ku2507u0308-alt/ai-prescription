import { useState, useEffect } from "react";
import { Prescription, MedicineReminder } from "../App";
import { ArrowLeft, TrendingUp, Check, X, Clock, Share2 } from "lucide-react";
import { toast } from "sonner";

interface AnalysisScreenProps {
  prescription: Prescription | null;
  onBack: () => void;
}

export function AnalysisScreen({ prescription, onBack }: AnalysisScreenProps) {
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [adherenceData, setAdherenceData] = useState<Record<string, { taken: number; total: number }>>({});

  useEffect(() => {
    if (prescription) {
      // Load reminders for this prescription
      const savedReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
      const prescriptionReminders = savedReminders.filter(
        (r: MedicineReminder) => r.prescriptionId === prescription.id
      );
      setReminders(prescriptionReminders);

      // Calculate adherence data
      const data: Record<string, { taken: number; total: number }> = {};
      prescription.medicines.forEach((med) => {
        const medReminders = prescriptionReminders.filter((r: MedicineReminder) => r.medicineId === med.id);
        const taken = medReminders.filter((r: MedicineReminder) => r.status === "taken").length;
        data[med.id] = { taken, total: medReminders.length };
      });
      setAdherenceData(data);
    }
  }, [prescription]);

  const handleShareReport = () => {
    toast.success("Adherence report shared with your doctor");
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

  // Calculate overall adherence
  const totalReminders = reminders.length;
  const takenReminders = reminders.filter((r) => r.status === "taken").length;
  const adherencePercentage = totalReminders > 0 ? Math.round((takenReminders / totalReminders) * 100) : 0;

  // Generate mock daily data for demonstration
  const generateDailyData = () => {
    const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
    return prescription.medicines.map((med) => {
      return {
        medicine: med.name,
        days: days.map(() => Math.random() > 0.3), // Random taken/missed for demo
      };
    });
  };

  const dailyData = generateDailyData();

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
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Adherence Analysis</h2>
              <p className="text-gray-600 text-sm">Track your medication compliance</p>
            </div>
          </div>

          {/* Overall Adherence Score */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center mb-6">
            <p className="text-sm font-medium mb-2 opacity-90">Overall Adherence</p>
            <p className="text-5xl font-bold mb-2">{adherencePercentage}%</p>
            <p className="text-sm opacity-90">
              {takenReminders} of {totalReminders} doses taken
            </p>
          </div>

          {/* Per Medicine Adherence */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Medicine-wise Adherence</h3>
            <div className="space-y-3">
              {prescription.medicines.map((medicine) => {
                const data = adherenceData[medicine.id] || { taken: 0, total: 0 };
                const percentage = data.total > 0 ? Math.round((data.taken / data.total) * 100) : 0;

                return (
                  <div key={medicine.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-800">{medicine.name}</span>
                      <span className="text-sm font-bold text-purple-600">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentage >= 80
                            ? "bg-green-500"
                            : percentage >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {data.taken} / {data.total} doses taken
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Tracking Table */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Daily Tracking</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-3 text-left text-sm font-bold text-gray-800">
                      Medicine
                    </th>
                    {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"].map((day) => (
                      <th key={day} className="border border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-800">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dailyData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-300 px-3 py-3 text-sm font-medium text-gray-800">
                        {row.medicine}
                      </td>
                      {row.days.map((taken, dayIndex) => (
                        <td key={dayIndex} className="border border-gray-300 px-3 py-3 text-center">
                          {taken ? (
                            <div className="flex justify-center">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" strokeWidth={3} />
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <X className="w-4 h-4 text-white" strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
              <div className="flex justify-center mb-2">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{takenReminders}</p>
              <p className="text-xs text-gray-600">Taken</p>
            </div>

            <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
              <div className="flex justify-center mb-2">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {reminders.filter((r) => r.status === "missed").length}
              </p>
              <p className="text-xs text-gray-600">Missed</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 text-center">
              <div className="flex justify-center mb-2">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {reminders.filter((r) => r.status === "delayed").length}
              </p>
              <p className="text-xs text-gray-600">Delayed</p>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShareReport}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Report with Doctor
          </button>

          {/* Insights */}
          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-bold text-gray-800 mb-2">💡 Insights</h4>
            {adherencePercentage >= 80 ? (
              <p className="text-sm text-gray-700">
                Excellent adherence! Keep up the good work. Consistent medication helps faster recovery.
              </p>
            ) : adherencePercentage >= 60 ? (
              <p className="text-sm text-gray-700">
                Good progress, but try to improve consistency. Set up reminders to never miss a dose.
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                Your adherence needs improvement. Missing doses can affect treatment effectiveness. Please consult your doctor.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
