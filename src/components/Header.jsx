'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiration');
    router.push('/');
  };

  return (
    <header className="w-full bg-black text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
      <Link href="/dashboard" className="text-2xl font-bold text-green-500 flex items-center gap-2">
        🎵 Spotify Taste Mixer
      </Link>
      <nav className="flex gap-4">
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-gray-300 hover:text-white transition"
        >
          Cerrar Sesión
        </button>
      </nav>
    </header>
  );
}