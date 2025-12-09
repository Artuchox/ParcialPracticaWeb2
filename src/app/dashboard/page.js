'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generatePlaylist } from '@/lib/spotify'; 
import { isAuthenticated, logout } from '@/lib/auth';

import GenreWidget from '@/components/widgets/GenreWidget';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';

export default function Dashboard() {
  const router = useRouter();
  
  // CAMBIO 1: Inicializamos como array vacío []
  const [selectedArtists, setSelectedArtists] = useState([]); 
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [mood, setMood] = useState({ valence: 50, energy: 50 });
  const [decades, setDecades] = useState([]);
  const [popularity, setPopularity] = useState(0);
  
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleGenerate = async () => {
    setLoading(true);
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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-green-500">Tu Dashboard</h1>
        <button onClick={() => { logout(); router.push('/'); }} className="text-gray-400 hover:text-white">
          Cerrar Sesión
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
          className="bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-12 rounded-full text-2xl transition-transform hover:scale-105 disabled:bg-gray-600"
        >
          {loading ? 'Mezclando...' : 'Generar Playlist 🎵'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlist.map((track) => (
          <div key={track.id} className="bg-gray-800 p-4 rounded flex items-center gap-4 hover:bg-gray-700 transition">
            {track.album.images[0] && (
              <img src={track.album.images[0].url} alt={track.name} className="w-16 h-16 rounded" />
            )}
            <div className="overflow-hidden">
              <p className="font-bold truncate text-white">{track.name}</p>
              <p className="text-gray-400 text-sm truncate">{track.artists.map(a => a.name).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}