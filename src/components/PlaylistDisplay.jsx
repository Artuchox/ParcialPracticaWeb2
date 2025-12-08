// Si usas TrackCard, asegúrate de importarlo, si no, usa un div simple por ahora
import TrackCard from './TrackCard'; 

export default function PlaylistDisplay({ tracks }) {
  if (!tracks || tracks.length === 0) return null;

  return (
    <div className="bg-gray-900 p-6 rounded-xl mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Tu Mix Generado</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
           // Si tienes el componente TrackCard úsalo, si no, usa este div:
           <div key={track.id} className="bg-gray-800 p-4 rounded flex items-center gap-4">
              {track.album.images[0] && (
                <img src={track.album.images[0].url} alt={track.name} className="w-12 h-12 rounded" />
              )}
              <div className="overflow-hidden">
                <p className="text-white font-bold truncate">{track.name}</p>
                <p className="text-gray-400 text-sm truncate">{track.artists[0].name}</p>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}