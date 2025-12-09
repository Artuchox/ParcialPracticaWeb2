'use client';

export default function TrackCard({ track, onRemove, isFavorite, onToggleFavorite }) {
  
  // Función auxiliar para formatear la duración (ms -> mm:ss)
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-4 hover:bg-gray-750 transition-colors border border-gray-700/50 hover:border-green-500/30 group">
      <div className="relative shrink-0">
        {track.album.images[0] ? (
          <img 
            src={track.album.images[0].url} 
            alt={track.name} 
            className="w-20 h-20 rounded object-cover shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-700 rounded flex items-center justify-center text-gray-500">
            N/A
          </div>
        )}
      </div>
      <div className="flex-grow overflow-hidden min-w-0">
        <h4 className="font-bold text-white text-lg truncate" title={track.name}>
          {track.name}
        </h4>
        <p className="text-green-400 text-sm truncate font-medium">
          {track.artists.map(a => a.name).join(', ')}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <span className="truncate max-w-[150px]" title={track.album.name}>
             {track.album.name}
          </span>
          <span>•</span>
          <span> {formatDuration(track.duration_ms)}</span>
          <span>•</span>
          <span title="Popularidad"> {track.popularity}%</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={() => onToggleFavorite(track)}
          className={`p-2 rounded-full transition-all ${
            isFavorite 
              ? 'text-green-500 bg-green-500/10 scale-110' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button
          onClick={() => onRemove(track.id)}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
          title="Eliminar de la lista"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}