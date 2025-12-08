'use client';

export default function GenreWidget({ value, onChange }) {
  const genres = ['pop', 'rock', 'hip-hop', 'reggaeton', 'electronic', 'latin', 'indie'];

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Género</h3>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Selecciona un género</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}