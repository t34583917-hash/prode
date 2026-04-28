'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Medal } from 'lucide-react';

export default function Ranking() {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data } = await supabase
        .from('perfiles')
        .select('nombre, puntos_totales')
        .order('puntos_totales', { ascending: false });
      setUsuarios(data || []);
    };
    fetchRanking();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Medal className="text-orange-500" /> Ranking de Amigos
      </h1>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-5 text-left text-gray-500 uppercase text-xs font-bold tracking-wider">Posición</th>
              <th className="p-5 text-left text-gray-500 uppercase text-xs font-bold tracking-wider">Nombre</th>
              <th className="p-5 text-right text-gray-500 uppercase text-xs font-bold tracking-wider">Puntos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.map((u, i) => (
              <tr key={i} className="hover:bg-blue-50/50 transition">
                <td className="p-5">
                   <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                     i === 0 ? 'bg-yellow-100 text-yellow-700' : 
                     i === 1 ? 'bg-gray-100 text-gray-700' : 
                     i === 2 ? 'bg-orange-100 text-orange-700' : 'text-gray-500'
                   }`}>
                     {i + 1}
                   </span>
                </td>
                <td className="p-5 font-medium text-gray-800">{u.nombre}</td>
                <td className="p-5 text-right">
                  <span className="text-xl font-bold text-blue-600">{u.puntos_totales}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
