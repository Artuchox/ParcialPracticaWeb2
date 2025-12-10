import { getAccessToken } from "./auth";

// Función auxiliar para obtener caracteristicas de audio (vibe y Energia)
async function getAudioFeatures(trackIds, token) {
  if (!trackIds.length) return [];
  
  // Spotify permite maximo 100 IDs por llamada
  const chunks = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    chunks.push(trackIds.slice(i, i + 100));
  }

  let allFeatures = [];
  
  for (const chunk of chunks) {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1{chunk.join(',')}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.audio_features) {
        allFeatures.push(...data.audio_features);
      }
    } catch (e) {
      console.error("Error fetching audio features", e);
    }
  }
  return allFeatures;
}

export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity, mood } = preferences; 
  const token = getAccessToken();

  if (!token) throw new Error("No token found");

  let allTracks = [];

  // 1. OBTENER TRACKS DE ARTISTAS
  if (artists && artists.length > 0) {
    const artistList = Array.isArray(artists) ? artists : [artists];
    for (const artistInput of artistList) {
      // Asumiendo que ArtistWidget envía IDs
      const artistId = typeof artistInput === 'string' ? artistInput : artistInput.id;
      if (artistId) {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (response.ok) {
            const data = await response.json();
            if(data.tracks) allTracks.push(...data.tracks);
          }
        } catch (error) { console.error(error); }
      }
    }
  }

  // 2. OBTENER TRACKS DE GÉNEROS
  if (genres && genres.length > 0) {
    for (const genre of genres) {
      try {
        const query = encodeURIComponent(`genre:${genre}`);
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          if(data.tracks && data.tracks.items) allTracks.push(...data.tracks.items);
        }
      } catch (error) { console.error(error); }
    }
  }

  // 3. ELIMINAR DUPLICADOS INICIALES
  let uniqueTracks = Array.from(new Map(allTracks.map(t => [t.id, t])).values());

  // 4. FILTRAR POR DÉCADA Y POPULARIDAD
  if (decades && decades.length > 0) {
    uniqueTracks = uniqueTracks.filter(track => {
      if (!track.album.release_date) return false;
      const year = parseInt(track.album.release_date.substring(0, 4));
      return decades.some(d => year >= parseInt(d) && year < parseInt(d) + 10);
    });
  }

  if (popularity !== undefined) {
    uniqueTracks = uniqueTracks.filter(track => track.popularity >= popularity);
  }

  // 5. FILTRAR POR MOOD (VALENCE & ENERGY) 
  if (mood && uniqueTracks.length > 0) {
    // Obtenemos los IDs de las canciones que pasaron los filtros anteriores
    const trackIds = uniqueTracks.map(t => t.id);
    
    // Llamamos a la API 
    const features = await getAudioFeatures(trackIds, token);
    // Convertimos a Map para búsqueda rápida
    const featuresMap = new Map(features.filter(f => f).map(f => [f.id, f]));
    const targetValence = mood.valence / 100;
    const targetEnergy = mood.energy / 100;

    uniqueTracks = uniqueTracks.filter(track => {
      const f = featuresMap.get(track.id);
      if (!f) return true; // Si no hay datos, la dejamos pasar por si acaso
      const valenceMatch = Math.abs(f.valence - targetValence) < 0.3;
      const energyMatch = Math.abs(f.energy - targetEnergy) < 0.3;

      return valenceMatch && energyMatch;
    });
  }

  // Shuffle final y corte
  return uniqueTracks.sort(() => 0.5 - Math.random()).slice(0, 30);
}

export async function searchArtist(query) {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=1`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();
    return data.artists?.items[0] || null;
  } catch (error) { return null; }
}