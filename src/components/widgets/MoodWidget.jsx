'use client';

export default function MoodWidget({ value, onChange }) {
    const getMoodLabel = (val) => {
    if (val < 25) return "Chill & Relax 🛌";
    if (val < 50) return "Buena vibra suave ☕";
    if (val < 75) return "Con energía ⚡";
    return "Fiesta total 🔥";
    };
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Energía: {value}%</h3>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}