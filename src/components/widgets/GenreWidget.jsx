'use client';

import { useState } from 'react';

export default function GenreWidget({ onChange }) {
  // Lista de géneros
  const genres = ['acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical', 'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal', 'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub', 'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro', 'french', 'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore', 'groove', 'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm', 'indian', 'indie', 'indie-pop', 'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin', 'latino', 'malay', 'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno', 'movies', 'mpb', 'new-age', 'new-release', 'opera', 'pagode', 'party', 'philippines-opm', 'piano', 'pop', 'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock', 'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae', 'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa', 'samba', 'sertanejo', 'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter', 'soul', 'soundtracks', 'spanish', 'study', 'summer', 'swedish', 'synth-pop', 'tango', 'techno', 'trance', 'trip-hop', 'turkish', 'work-out', 'world-music'];

  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleSelect = (e) => {
    const genre = e.target.value;
    if (!genre) return;

    // Validar duplicados
    if (selectedGenres.includes(genre)) {
      alert("¡Ya seleccionaste ese género!");
      e.target.value = ""; 
      return;
    }

    // Validar máximo 4
    if (selectedGenres.length >= 4) {
      alert("Máximo 4 géneros para la mezcla.");
      e.target.value = ""; 
      return;
    }

    const newList = [...selectedGenres, genre];
    setSelectedGenres(newList);
    onChange(newList); // Avisar al padre
    e.target.value = ""; // Resetear select para elegir otro
  };

  const removeGenre = (genreToRemove) => {
    const newList = selectedGenres.filter(g => g !== genreToRemove);
    setSelectedGenres(newList);
    onChange(newList);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Géneros ({selectedGenres.length}/4)</h3>
      
      <select
        onChange={handleSelect}
        disabled={selectedGenres.length >= 4}
        className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
      >
        <option value="">
          {selectedGenres.length >= 4 ? "Límite alcanzado" : "Añadir un género..."}
        </option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </option>
        ))}
      </select>

      <div className="flex flex-wrap gap-2">
        {selectedGenres.map((g) => (
          <span 
            key={g} 
            className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 animate-fadeIn"
          >
            {g.replace(/-/g, ' ')}
            <button 
              onClick={() => removeGenre(g)} 
              className="hover:text-black font-extrabold ml-1"
            >
              ✕
            </button>
          </span>
        ))}
        {selectedGenres.length === 0 && (
          <p className="text-gray-500 text-sm italic">Selecciona hasta 4 géneros.</p>
        )}
      </div>
    </div>
  );
}
