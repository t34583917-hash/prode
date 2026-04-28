'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Medal, Trophy } from 'lucide-react';

export default function Ranking() {
  const searchParams = useSearchParams();
  const ligaId = searchParams.get('liga');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [nombreLiga, setNombreLiga] = useState('Global');

  useEffect(() => {
    const fetchRanking = async () => {
      let query = supabase
        .from('perfiles')
        .select('nombre, puntos_totales');

      if (ligaId) {
        // Obtener nombre de la liga
        const { data: liga } = await supabase.from('ligas').select('nombre').eq('id', ligaId).single();
        if (liga) setNombreLiga(liga.nombre);

        // Filtrar por miembros de la liga
        const { data: miembros } = await supabase.from('liga_miembros').select('perfil_id').eq('liga_id', ligaId);
        const ids = miembros?.map(m => m.perfil_id) || [];
        query = query.in('id', ids);
      }

      const { data } = await query.order('puntos_totales', { ascending: false });
      setUsuarios(data || []);
    };
    fetchRanking();
  }, [ligaId]);

  return (
    <div className="max-w-2xl mx-auto p-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 flex items-center justify-center gap-3">
          <Trophy className="text-yellow-500" size={40} /> Ranking {nombreLiga}
        </h1>
        <p className="text-gray-500 mt-2 italic">Solo los mejores aparecen aquí</p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Pos</th>
              <th className="p-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Jugador</th>
              <th className="p-6 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {usuarios.map((u, i) => (
              <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-6">
                   <span className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-lg ${
                     i === 0 ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-200' : 
                     i === 1 ? 'bg-gray-300 text-white shadow-lg shadow-gray-200' : 
                     i === 2 ? 'bg-orange-400 text-white shadow-lg shadow-orange-200' : 'text-gray-400'
                   }`}>
                     {i + 1}
                   </span>
                </td>
                <td className="p-6 font-bold text-gray-800 text-lg">{u.nombre.split('@')[0]}</td>
                <td className="p-6 text-right">
                  <span className="text-2xl font-black text-blue-600">{u.puntos_totales}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!ligaId && (
        <div className="mt-8 text-center">
          <a href="/ligas" className="text-blue-600 font-bold hover:underline">← Ir a Mis Ligas para ver rankings privados</a>
        </div>
      )}
    </div>
  );
}
