"use client" 

import { useState } from 'react'
import { searchArtist } from '@/lib/spotify' 

export default function ArtistWidget({ onChange }) {
  const [query, setQuery] = useState('')
  const [artist, setArtist] = useState(null) // Aquí guardamos el artista encontrado
  const [loading, setLoading] = useState(false)

  // Esta función se ejecuta cuando le damos al botón "Buscar"
  const handleSearch = async () => {
    if (!query) return;
    
    setLoading(true);
    const result = await searchArtist(query); // Llamamos a la API
    setLoading(false);

    if (result) {
      setArtist(result);
      // Aquí avisamos al Dashboard del ID
      onChange(result.id); 
    } else {
      alert("Artista no encontrado");
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4"> Artista Base</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Ej. Feid"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // Permitir buscar al pulsar Enter
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white px-4 rounded font-bold transition-colors"
          disabled={loading}
        >
          {loading ? '...' : 'buscar'}
        </button>
      </div>
      {artist && (
        <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-green-500/30">
          {artist.images?.[0] && (
            <img 
              src={artist.images[0].url} 
              alt={artist.name} 
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-green-400 text-sm font-semibold">Seleccionado:</p>
            <p className="text-white font-bold">{artist.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}