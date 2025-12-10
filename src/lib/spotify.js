import { getAccessToken } from "./auth";

export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity } = preferences;
  const token = getAccessToken();
  let allTracks = [];

  // 1. Obtener top tracks de artistas seleccionados
  if (artists && artists.length > 0) {
    for (const artist of artists) {
      try {
        const tracks = await fetch(
          `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        const data = await tracks.json();
        if (data.tracks) {
            allTracks.push(...data.tracks);
        }
      } catch (e) {
        console.error("Error fetching artist tracks", e);
      }
    }
  }

  // 2. Buscar por géneros
  if (genres && genres.length > 0) {
    for (const genre of genres) {
      try {
        const results = await fetch(
          `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&type=track&limit=20`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        const data = await results.json();
        if (data.tracks && data.tracks.items) {
             allTracks.push(...data.tracks.items);
        }
      } catch (e) {
        console.error("Error fetching genre tracks", e);
      }
    }
  }

  // 3. Filtrar por década
  if (decades && decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // 4. Filtrar por popularidad
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // 5. Eliminar duplicados y limitar a 30 canciones
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30);

  return uniqueTracks;
}

// Esta función auxiliar la necesita ArtistWidget 
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