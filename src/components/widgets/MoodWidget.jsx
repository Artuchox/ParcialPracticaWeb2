'use client';

export default function MoodWidget({ value, onChange }) {
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
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>Chill </span>
        <span>Fiesta </span>
      </div>
    </div>
  );
}