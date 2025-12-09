'use client';

export default function PopularityWidget({ value, onChange }) {
  // Value será el mínimo de popularidad (0 a 100)
  
  const getLabel = () => {
    if (value < 20) return " Joyas Ocultas (Underground)";
    if (value < 50) return " Escena Indie / Emergente";
    if (value < 80) return " Éxitos Conocidos";
    return " Top Global Hits";
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2">Popularidad Mínima</h3>
      <p className="text-sm text-green-400 mb-4">{getLabel()}</p>
      
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Nicho</span>
        <span>Mainstream</span>
      </div>
    </div>
  );
}