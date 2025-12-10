'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generatePlaylist } from '@/lib/spotify'; 
import { isAuthenticated, logout } from '@/lib/auth';

import styles from './dashboard.module.css';

// Widgets 
import GenreWidget from '@/components/widgets/GenreWidget';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';      
import PopularityWidget from '@/components/widgets/PopularityWidget'; 

import TrackCard from '@/components/TrackCard';

export default function Dashboard() {
  const router = useRouter();
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

  // generar la playlist
  const handleGenerate = async () => {
    setLoading(true);
    setPlaylist([]); 
    try {
      // 1. Artistas: Convertimos ['id1', 'id2'] a [{id: 'id1'}, {id: 'id2'}]
      const artistsObjects = selectedArtists.map(id => ({ id: id }));

      // 2. Popularidad: Convertimos 50 a [50, 100] (Rango min-max)
      const popularityRange = [popularity, 100];

      const tracks = await generatePlaylist({
        genres: selectedGenres,
        artists: artistsObjects, // Enviamos objetos
        decades: decades,       
        popularity: popularityRange, // Enviamos array [min, max]
      });
      setPlaylist(tracks);
    } catch (error) {
      console.error(error);
      alert("Error generando playlist");
    }
    setLoading(false);
  };

  const handleAddMore = async () => {
    setLoading(true);
    try {
      const artistsObjects = selectedArtists.map(id => ({ id: id }));
      const popularityRange = [popularity, 100];

      const newTracks = await generatePlaylist({
        genres: selectedGenres,
        artists: artistsObjects,
        decades: decades,       
        popularity: popularityRange
      });

      const currentIds = new Set(playlist.map(t => t.id));
      const uniqueNewTracks = newTracks.filter(track => !currentIds.has(track.id));

      if (uniqueNewTracks.length === 0) {
        alert("No se encontraron canciones nuevas.");
      } else {
        setPlaylist(prev => [...prev, ...uniqueNewTracks]);
      }
    } catch (error) {
      console.error(error);
      alert("Error añadiendo canciones");
    }
    setLoading(false);
  };

  // funciones de la gestion
  const removeTrack = (trackId) => {
    setPlaylist(playlist.filter(track => track.id !== trackId));
  }

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
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Spotify Taste Mixer - Proyecto Final</h1>
          <p className={styles.subtitle}>Creado por Art Schmitz</p>
        </div>
        <button onClick={() => { logout(); router.push('/'); }} className={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </header>
      <div className={styles.widgetsGrid}>
        <ArtistWidget onChange={setSelectedArtists} />
        <GenreWidget onChange={setSelectedGenres} />
        <MoodWidget values={mood} onChange={setMood} />
        <DecadeWidget selectedDecades={decades} onChange={setDecades} />
        <PopularityWidget value={popularity} onChange={setPopularity} />
      </div>
      <div className={styles.actionsContainer}>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className={styles.btnPrimary}
        >
          {loading ? 'Mezclando...' : 'Generar Playlist 🎵'}
        </button>

        {playlist.length > 0 && (
          <button 
            onClick={handleAddMore}
            disabled={loading}
            className={styles.btnSecondary}
          >
            + Añadir más
          </button>
        )}
      </div>
      {playlist.length > 0 && (
        <div className={styles.resultsContainer}>
          <h2 className={styles.resultsHeader}>
            Resultados <span className={styles.count}>({playlist.length})</span>
          </h2>
          
          <div className={styles.tracksGrid}>
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