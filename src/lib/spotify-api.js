import axios from 'axios';

const spotifyApi = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});

// Interceptor para añadir el token automáticamente
spotifyApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('spotify_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default spotifyApi;