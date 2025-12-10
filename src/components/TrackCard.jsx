'use client';
import styles from './TrackCard.module.css';

export default function TrackCard({ track, onRemove, isFavorite, onToggleFavorite }) {
  
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {track.album.images[0] ? (
          <img 
            src={track.album.images[0].url} 
            alt={track.name} 
            className={styles.image}
          />
        ) : (
          <div className={styles.noImage}>N/A</div>
        )}
      </div>
      <div className={styles.info}>
        <h4 className={styles.title} title={track.name}>
          {track.name}
        </h4>
        <p className={styles.artist}>
          {track.artists.map(a => a.name).join(', ')}
        </p>
        <div className={styles.meta}>
          <span title={track.album.name}>album {track.album.name.substring(0, 20)}...</span>
          <span>-</span>
          <span>tiempo {formatDuration(track.duration_ms)}</span>
          <span>-</span>
          <span title="Popularidad">popularidad {track.popularity}%</span>
        </div>
      </div>
      <div className={styles.actions}>
        <button
          onClick={() => onToggleFavorite(track)}
          className={`${styles.actionBtn} ${isFavorite ? styles.btnFavoriteActive : styles.btnFavorite}`}
          title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <button
          onClick={() => onRemove(track.id)}
          className={`${styles.actionBtn} ${styles.btnRemove}`}
          title="Eliminar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}