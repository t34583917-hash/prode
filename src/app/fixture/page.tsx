'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy } from 'lucide-react';

export default function Fixture() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartidos = async () => {
      const { data } = await supabase.from('partidos').select('*').order('fecha', { ascending: true });
      setPartidos(data || []);
      setLoading(false);
    };
    fetchPartidos();
  }, []);

  const handlePredict = async (partidoId: number, golesLocal: number, golesVisitante: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Debes iniciar sesión');

    const { error } = await supabase.from('predicciones').upsert({
      user_id: user.id,
      partido_id: partidoId,
      goles_local: golesLocal,
      goles_visitante: golesVisitante,
    }, { onConflict: 'user_id,partido_id' });

    if (error) alert('Error al guardar predicción');
    else alert('Predicción guardada!');
  };

  if (loading) return <div className="p-8 text-center">Cargando partidos...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" /> Fixture Mundial 2026
      </h1>
      <div className="grid gap-4">
        {partidos.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-right font-semibold text-gray-700">{p.local}</div>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                placeholder="0"
                className="w-14 border-2 border-gray-100 rounded-lg p-2 text-center focus:border-blue-500 outline-none transition" 
                onChange={(e) => p.tempLocal = parseInt(e.target.value)}
              />
              <span className="font-bold text-gray-400">VS</span>
              <input 
                type="number" 
                placeholder="0"
                className="w-14 border-2 border-gray-100 rounded-lg p-2 text-center focus:border-blue-500 outline-none transition" 
                onChange={(e) => p.tempVisitante = parseInt(e.target.value)}
              />
            </div>
            <div className="flex-1 text-center md:text-left font-semibold text-gray-700">{p.visitante}</div>
            <button 
              onClick={() => handlePredict(p.id, p.tempLocal, p.tempVisitante)}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition shadow-md active:scale-95"
            >
              Predecir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
