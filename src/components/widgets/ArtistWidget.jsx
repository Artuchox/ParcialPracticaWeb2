"use client" 

export default function ArtistWidget({ value, onChange }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Artista Base</h3>
      <input
        type="text"
        placeholder="Ej. Bad Bunny"
        value={value} // El valor viene del padre (Dashboard)
        onChange={(e) => onChange(e.target.value)} // Avisamos al padre del cambio 
        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  )
}