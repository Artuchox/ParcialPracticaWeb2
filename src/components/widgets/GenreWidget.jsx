'use client';

export default function GenreWidget({ value, onChange }) {
  const genres = ['acoustic', 'alt-rock', 'alternative', 'anime', 'bluegrass', 'blues', 
    'bossanova', 'classical', 'country', 'dance', 'disco', 'drum-and-bass', 
    'dubstep', 'edm', 'electronic', 'emo', 'folk', 'funk', 'grunge', 
    'hard-rock', 'heavy-metal', 'hip-hop', 'house', 'indie', 'indie-pop', 
    'jazz', 'k-pop', 'latin', 'lo-fi', 'metal', 'pop', 'punk', 'r-n-b', 
    'reggae', 'reggaeton', 'rock', 'salsa', 'soul', 'soundtrack', 
    'synth-pop', 'techno', 'trap', 'work-out'];

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