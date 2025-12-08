import { getAccessToken } from "./auth";

// 2. Función auxiliar para buscar el ID de un artista dado su nombre
// Esto es necesario porque para pedir "top-tracks" necesitas el ID numérico, no el nombre.
async function getArtistId(artistName, token) {
  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await res.json();
    return data.artists?.items[0]?.id || null;
  } catch (error) {
    console.error(`Error buscando artista ${artistName}:`, error);
    return null;
  }
}

// 3. Función principal para generar la playlist
export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity } = preferences;
  const token = getAccessToken();

  if (!token) {
    throw new Error("No se encontró el token de acceso. Por favor, inicia sesión.");
  }

  let allTracks = [];

  // Obtener canciones de Artistas
  if (artists && artists.length > 0) {
    for (const artistInput of artists) {
      let artistId = null;

      // Si el input es un objeto con id, úsalo. Si es string (nombre), búscalo.
      if (typeof artistInput === 'object' && artistInput.id) {
        artistId = artistInput.id;
      } else if (typeof artistInput === 'string') {
        artistId = await getArtistId(artistInput, token);
      }

      if (artistId) {
        try {
          // Endpoint correcto de Spotify para Top Tracks
          const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
            {
              headers: { 'Authorization': `Bearer ${token}` } 
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            // Añadimos las canciones encontradas al array general
            allTracks.push(...data.tracks);
          }
        } catch (error) {
          console.error(`Error obteniendo top tracks para ${artistId}`, error);
        }
      }
    }
  }

  //Buscar canciones por Género 
  if (genres && genres.length > 0) {
    for (const genre of genres) {
      try {
        // Usamos el endpoint de Search filtrando por genre:
        const query = encodeURIComponent(`genre:${genre}`);
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (response.ok) {
          const data = await response.json();
          allTracks.push(...data.tracks.items);
        }
      } catch (error) {
        console.error(`Error buscando género ${genre}`, error);
      }
    }
  }

  //Filtrar por Década (Tu lógica original) 
  if (decades && decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const releaseDate = track.album.release_date; 
      const year = parseInt(releaseDate.substring(0, 4));
      
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // Filtrar por Popularidad (Tu lógica original) 
  if (popularity) {
    // Aseguramos que popularity sea un array [min, max]
    // Si viene del slider del Dashboard puede que sea un solo número (el mínimo)
    let min, max;
    if (Array.isArray(popularity)) {
      [min, max] = popularity;
    } else {
      min = popularity;
      max = 100;
    }

    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }
  
  // Eliminar duplicados y limitar resultado 
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30); // Limitamos a 30 canciones

  return uniqueTracks;
}

// 4. Función para buscar el artista
export async function searchArtist(query) {
  const token = getAccessToken(); // Reutilizamos la función que lee del localStorage
  
  if (!token) return null;

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=1`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const data = await response.json();
    // Devolvemos el primer artista encontrado (o null si no hay nada)
    return data.artists?.items[0] || null;
  } catch (error) {
    console.error("Error buscando artista:", error);
    return null;
  }
}