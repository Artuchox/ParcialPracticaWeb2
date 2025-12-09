import { getAccessToken } from "./auth";

// 1. Función para generar la playlist
export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity } = preferences;
  const token = getAccessToken();

  if (!token) {
    throw new Error("No se encontró el token de acceso.");
  }

  let allTracks = [];

  // --- ARREGLO ARTISTAS ---
  if (artists && artists.length > 0) {
    // Aseguramos que sea un array
    const artistList = Array.isArray(artists) ? artists : [artists];

    for (const artistInput of artistList) {
      let artistId = null;

      // Si el widget envía el ID directamente (que es lo que hace tu ArtistWidget actual)
      if (typeof artistInput === 'string') {
        artistId = artistInput; 
      } 
      // Si por alguna razón enviaras un objeto completo
      else if (typeof artistInput === 'object' && artistInput.id) {
        artistId = artistInput.id;
      }

      if (artistId) {
        try {
          // Usamos la URL correcta de la API de Spotify
          const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
            {
              headers: { 'Authorization': `Bearer ${token}` } 
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            // Añadimos las canciones encontradas
            if(data.tracks) allTracks.push(...data.tracks);
          }
        } catch (error) {
          console.error(`Error obteniendo top tracks para ${artistId}`, error);
        }
      }
    }
  }

  // --- GÉNEROS ---
  if (genres && genres.length > 0) {
    const genreList = Array.isArray(genres) ? genres : [genres];
    for (const genre of genreList) {
      if(!genre) continue;
      try {
        const query = encodeURIComponent(`genre:${genre}`);
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if(data.tracks && data.tracks.items) allTracks.push(...data.tracks.items);
        }
      } catch (error) {
        console.error(`Error buscando género ${genre}`, error);
      }
    }
  }

  // --- FILTRAR POR DÉCADA ---
  if (decades && decades.length > 0) {
    allTracks = allTracks.filter(track => {
      if (!track.album.release_date) return false;
      const year = parseInt(track.album.release_date.substring(0, 4));
      
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // --- FILTRAR POR POPULARIDAD ---
  if (popularity !== undefined) {
    // El widget devuelve un número (ej. 50), filtramos lo que sea MAYOR a eso
    allTracks = allTracks.filter(track => track.popularity >= popularity);
  }
  
  // Eliminar duplicados y limitar a 30
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30);

  // Mezclar resultados (Shuffle)
  return uniqueTracks.sort(() => 0.5 - Math.random());
}

// 2. Función para buscar artista (usada por el widget)
export async function searchArtist(query) {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=1`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const data = await response.json();
    return data.artists?.items[0] || null;
  } catch (error) {
    console.error("Error buscando artista:", error);
    return null;
  }
}