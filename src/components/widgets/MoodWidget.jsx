'use client';

export default function MoodWidget({ values, onChange }) {
  const handleChange = (key, newValue) => {
    onChange({
      ...values,
      [key]: Number(newValue)
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
      <h3 className="text-xl font-bold text-white mb-2">Vibe & Energía</h3>
      <div>
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Melancólico</span>
          <span className="text-green-400 font-bold">{values.valence}%</span>
          <span>Feliz</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={values.valence}
          onChange={(e) => handleChange('valence', e.target.value)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div>
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Calma</span>
          <span className="text-green-400 font-bold">{values.energy}%</span>
          <span>Energetico</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={values.energy}
          onChange={(e) => handleChange('energy', e.target.value)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
      </div>
    </div>
  );
}