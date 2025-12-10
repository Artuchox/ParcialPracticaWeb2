'use client'

import { useState } from 'react'
import { searchArtist } from '@/lib/spotify'

export default function ArtistWidget({ onChange }) {
  const [query, setQuery] = useState('')
  const [selectedArtists, setSelectedArtists] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    const result = await searchArtist(query);
    setLoading(false);

    if (result) {
      // Verificar si ya esta en la lista para no repetir
      const alreadySelected = selectedArtists.find(a => a.id === result.id);
      
      if (alreadySelected) {
        alert("¡Este artista ya está en tu lista!");
      } else if (selectedArtists.length >= 5) {
        alert("Máximo 5 artistas por mezcla.");
      } else {
        // Añadimos el nuevo artista a la lista existente
        const newList = [...selectedArtists, result];
        setSelectedArtists(newList);
        
        // Enviamos al padre (Dashboard) SOLO los IDs
        const ids = newList.map(a => a.id);
        onChange(ids);
        
        // Limpia el buscador
        setQuery(''); 
      }
    } else {
      alert("Artista no encontrado");
    }
  }

  const removeArtist = (artistId) => {
    const newList = selectedArtists.filter(a => a.id !== artistId);
    setSelectedArtists(newList);
    // Actualiza al padre
    onChange(newList.map(a => a.id));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Artistas Base ({selectedArtists.length}/5)</h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Ej. Feid"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white px-4 rounded font-bold transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '...' : '+'}
        </button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {selectedArtists.map((artist) => (
          <div key={artist.id} className="flex items-center justify-between bg-gray-900 p-2 rounded border border-gray-600">
            <div className="flex items-center gap-3">
              {artist.images?.[0] && (
                <img 
                  src={artist.images[0].url} 
                  alt={artist.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <p className="text-white font-medium text-sm">{artist.name}</p>
            </div>
            <button 
              onClick={() => removeArtist(artist.id)}
              className="text-gray-400 hover:text-red-500 font-bold px-2"
            >
              ✕
            </button>
          </div>
        ))}
        
        {selectedArtists.length === 0 && (
          <p className="text-gray-500 text-sm italic text-center">
            Busca y añade artistas para mezclar.
          </p>
        )}
      </div>
    </div>
  )
}