import TrackCard from './TrackCard'

export default function PlaylistDisplay({ tracks }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-white">Tu Mix Generado</h2>
      <div className="grid gap-4">
        {tracks.map((track) => (
          // Usamos TrackCard para cada item, pasando la key única
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  )
}