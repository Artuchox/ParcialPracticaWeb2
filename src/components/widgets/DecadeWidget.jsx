'use client';

export default function DecadeWidget({ selectedDecades, onChange }) {
  const decades = ['1960', '1970', '1980', '1990', '2000', '2010', '2020'];

  const toggleDecade = (decade) => {
    // Si ya está seleccionado, lo quitamos. Si no, lo agregamos.
    if (selectedDecades.includes(decade)) {
      onChange(selectedDecades.filter(d => d !== decade));
    } else {
      onChange([...selectedDecades, decade]);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Décadas</h3>
      <div className="grid grid-cols-3 gap-2">
        {decades.map((decade) => {
          const isSelected = selectedDecades.includes(decade);
          return (
            <button
              key={decade}
              onClick={() => toggleDecade(decade)}
              className={`py-2 px-1 rounded text-sm font-semibold transition-colors
                ${isSelected 
                  ? 'bg-green-500 text-black' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {decade}s
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        {selectedDecades.length === 0 
          ? "Todas las décadas incluidas" 
          : `Seleccionadas: ${selectedDecades.length}`}
      </p>
    </div>
  );
}