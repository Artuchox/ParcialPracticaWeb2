'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya esta autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-5xl font-bold mb-8 text-green-500">Spotify Mixer</h1>
      <p className="text-xl mb-8 text-gray-300">Mezcla tus artistas favoritos y descubre música nueva.</p>
      
      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-10 rounded-full text-xl transition-transform transform hover:scale-105"
      >
        Iniciar Sesión con Spotify
      </button>
    </div> 
  );
}


