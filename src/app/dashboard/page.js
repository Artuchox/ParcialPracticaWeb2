'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generatePlaylist } from '@/lib/spotify'; 
import { isAuthenticated, logout } from '@/lib/auth';

// Widgets
import GenreWidget from '@/components/widgets/GenreWidget';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';      
import PopularityWidget from '@/components/widgets/PopularityWidget'; 
import TrackCard from '@/components/TrackCard';

export default function Dashboard() {
  const router = useRouter();
  
  //ESTADOS
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [mood, setMood] = useState({ valence: 50, energy: 50 });
  const [decades, setDecades] = useState([]);      
  const [popularity, setPopularity] = useState(0); 
  
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoritesRefresh, setFavoritesRefresh] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleGenerate = async () => {
    setLoading(true);
    setPlaylist([]); 
    try {
      const tracks = await generatePlaylist({
        genres: selectedGenres,
        artists: selectedArtists,
        decades: decades,       
        popularity: popularity, 
        mood: mood
      });
      setPlaylist(tracks);
    } catch (error) {
      console.error(error);
      alert("Error generando playlist");
    }
    setLoading(false);
  };
  // Eliminar Tracks Individuales
  const removeTrack = (trackId) => {
    setPlaylist(playlist.filter(track => track.id !== trackId));
  }

  // Marcar Tracks como Favoritos 
  const toggleFavorite = (track) => {
    const favorites = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
    const isFavorite = favorites.find(f => f.id === track.id);

    if (isFavorite) {
      const updated = favorites.filter(f => f.id !== track.id);
      localStorage.setItem('favorite_tracks', JSON.stringify(updated));
    } else {
      favorites.push(track);
      localStorage.setItem('favorite_tracks', JSON.stringify(favorites));
    }
    setFavoritesRefresh(prev => prev + 1);
  }
  const checkIsFavorite = (trackId) => {
    if (typeof window === 'undefined') return false;
    const favorites = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
    return favorites.some(f => f.id === trackId);
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 pb-32">
      <header className="flex justify-between items-center mb-10 sticky top-0 bg-black/90 backdrop-blur z-50 py-4 border-b border-gray-800">
        <div>
          <h1 className="text-4xl font-bold text-green-500">Tu Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Mezcla, descubre y guarda.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => { logout(); router.push('/'); }} className="text-gray-400 hover:text-white font-medium">
            Cerrar Sesión
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <ArtistWidget onChange={setSelectedArtists} />
        <GenreWidget onChange={setSelectedGenres} />
        <MoodWidget values={mood} onChange={setMood} />
        <DecadeWidget selectedDecades={decades} onChange={setDecades} />
        <PopularityWidget value={popularity} onChange={setPopularity} />
      </div>
      <div className="flex justify-center mb-12">
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-green-500 hover:bg-green-400 text-black font-extrabold py-4 px-16 rounded-full text-2xl transition-all hover:scale-105 disabled:bg-gray-700"
        >
          {loading ? 'Mezclando...' : 'Generar Playlist 🎵'}
        </button>
      </div>
      {playlist.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Resultados <span className="text-sm font-normal text-gray-400">({playlist.length})</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playlist.map((track) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                onRemove={removeTrack}
                onToggleFavorite={toggleFavorite}
                isFavorite={checkIsFavorite(track.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}