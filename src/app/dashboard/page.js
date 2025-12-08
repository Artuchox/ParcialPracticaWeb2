"use client"

import { useState } from 'react'
// Importo los componentes
import ArtistWidget from '@/components/widgets/ArtistWidget'
import GenreWidget from '@/components/widgets/GenreWidget'
import MoodWidget from '@/components/widgets/MoodWidget'
import PlaylistDisplay from '@/components/PlaylistDisplay'
// Importo la función de lógica 
import { getRecommendations } from '@/lib/spotify' 

export default function Dashboard() {
  // 1. ESTADO: Aquí guardamo lo que el usuario selecciona en los Widgets 
  const [filters, setFilters] = useState({
    artist: '',
    genre: '',
    mood: 50, // Ejemplo: valor de 0 a 100
  })

  // Estado para guardar las canciones que recibamos de Spotify
  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(false)

  // 2. HANDLERS: Funciones para actualizar el estado desde los hijos [cite: 311, 317]
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  // 3. GENERAR PLAYLIST: Lógica al hacer click en "Generar"
  async function handleGenerate() {
    setLoading(true)
    try {
      // Aquí se llama a la función de lib/spotify.js pasando los filtros
      // NOTA: Asegúrate de pasar el token si es necesario, o manejarlo internamente
      const tracks = await getRecommendations(filters) 
      setPlaylist(tracks)
    } catch (error) {
      console.error("Error generando playlist:", error)
      alert("Hubo un error contactando con Spotify")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Mixer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <ArtistWidget 
          value={filters.artist} 
          onChange={(val) => handleFilterChange('artist', val)} 
        />

        <GenreWidget 
          value={filters.genre} 
          onChange={(val) => handleFilterChange('genre', val)} 
        />

        <MoodWidget 
          value={filters.mood} 
          onChange={(val) => handleFilterChange('mood', val)} 
        />
        
      </div>


      <div className="flex justify-center mb-10">
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all"
        >
          {loading ? 'Mezclando...' : 'Generar Playlist'}
        </button>
      </div>
      {playlist.length > 0 && (
        <PlaylistDisplay tracks={playlist} />
      )}
    </div>
  )
}