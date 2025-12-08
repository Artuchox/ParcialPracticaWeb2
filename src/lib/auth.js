// src/lib/auth.js

// Generar string aleatorio para el parámetro 'state' (seguridad)
export function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Construir URL de autorización de Spotify
export function getSpotifyAuthUrl() {
  // Usamos NEXT_PUBLIC_ para que las variables sean visibles en el navegador
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const state = generateRandomString(16);

  // Guardar el state para validación posterior (prevenir CSRF)
  if (typeof window !== 'undefined') {
    localStorage.setItem('spotify_auth_state', state);
  }

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    // Descomenta estas líneas si tu app en el dashboard de Spotify tiene estos permisos activados
    // 'playlist-modify-public',
    // 'playlist-modify-private'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: scope
  });

  // CORRECCIÓN: URL oficial de Spotify
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Guardar tokens en localStorage
export function saveTokens(accessToken, refreshToken, expiresIn) {
  const expirationTime = Date.now() + expiresIn * 1000;
  
  // Nombres de claves unificados con lo que espera tu archivo spotify.js
  localStorage.setItem('spotify_access_token', accessToken);
  localStorage.setItem('spotify_refresh_token', refreshToken);
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
}

// Obtener token actual (con verificación de expiración)
export function getAccessToken() {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('spotify_access_token');
  const expiration = localStorage.getItem('spotify_token_expiration');
  
  if (!token || !expiration) return null;
  
  // Si el token expiró, retornar null (aquí podrías implementar la lógica de refresh si quisieras)
  if (Date.now() > parseInt(expiration)) {
    console.warn("El token ha expirado");
    return null;
  }
  
  return token;
}

// Verificar si hay token válido
export function isAuthenticated() {
  return getAccessToken() !== null;
}

// Cerrar sesión
export function logout() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiration');
  // Opcional: recargar la página o redirigir al home
  window.location.href = '/';
}