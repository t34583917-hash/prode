'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Plus, Hash } from 'lucide-react';

export default function Ligas() {
  const [nombreLiga, setNombreLiga] = useState('');
  const [codigoJoin, setCodigoJoin] = useState('');
  const [misLigas, setMisLigas] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) fetchLigas(session.user.id);
    });
  }, []);

  const fetchLigas = async (userId: string) => {
    const { data } = await supabase
      .from('liga_miembros')
      .select('ligas(id, nombre, codigo)')
      .eq('perfil_id', userId);
    setMisLigas(data?.map(d => d.ligas) || []);
  };

  const crearLiga = async () => {
    if (!nombreLiga) return;
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data: liga, error } = await supabase
      .from('ligas')
      .insert({ nombre: nombreLiga, codigo, creador_id: user.id })
      .select()
      .single();

    if (liga) {
      await supabase.from('liga_miembros').insert({ liga_id: liga.id, perfil_id: user.id });
      alert('Liga creada! Código: ' + codigo);
      window.location.reload();
    }
  };

  const unirseLiga = async () => {
    const { data: liga } = await supabase.from('ligas').select('id').eq('codigo', codigoJoin).single();
    if (liga) {
      const { error } = await supabase.from('liga_miembros').insert({ liga_id: liga.id, perfil_id: user.id });
      if (error) alert('Ya estás en esta liga');
      else window.location.reload();
    } else {
      alert('Código inválido');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-2">
        <Users className="text-blue-600" /> Mis Ligas
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus /> Crear Nueva Liga</h2>
          <input 
            className="w-full p-3 border rounded-lg mb-4" 
            placeholder="Nombre de la liga (ej: Oficina)" 
            onChange={e => setNombreLiga(e.target.value)}
          />
          <button onClick={crearLiga} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">Crear Liga</button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Hash /> Unirse con Código</h2>
          <input 
            className="w-full p-3 border rounded-lg mb-4" 
            placeholder="Código (ej: AX72P9)" 
            onChange={e => setCodigoJoin(e.target.value.toUpperCase())}
          />
          <button onClick={unirseLiga} className="w-full bg-green-600 text-white p-3 rounded-lg font-bold">Unirse</button>
        </div>
      </div>

      <div className="grid gap-4">
        {misLigas.map(l => (
          <div key={l.id} className="bg-white p-5 rounded-xl border flex justify-between items-center">
            <div>
              <div className="font-bold text-lg">{l.nombre}</div>
              <div className="text-sm text-gray-500">Código: <span className="font-mono font-bold text-blue-600">{l.codigo}</span></div>
            </div>
            <a href={`/ranking?liga=${l.id}`} className="text-blue-600 font-bold hover:underline">Ver Ranking →</a>
          </div>
        ))}
      </div>
    </div>
  );
}
