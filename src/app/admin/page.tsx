'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, CheckCircle, Clock } from 'lucide-react';

// ACÁ PONÉ TU EMAIL PARA QUE SOLO VOS SEAS EL ADMIN
const ADMIN_EMAIL = 'felicardona1713@gmail.com'; // Cambialo por el tuyo

export default function AdminPanel() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        fetchPartidos();
      } else {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  const fetchPartidos = async () => {
    const { data } = await supabase.from('partidos').select('*').order('fecha', { ascending: true });
    setPartidos(data || []);
    setLoading(false);
  };

  const updateRealScore = async (partidoId: number, local: number, visitante: number) => {
    const { error } = await supabase
      .from('partidos')
      .update({
        goles_local: local,
        goles_visitante: visitante,
        estado: 'jugado'
      })
      .eq('id', partidoId);

    if (error) alert('Error: ' + error.message);
    else {
      alert('¡Partido Finalizado! Los puntos se han recalculado.');
      fetchPartidos();
    }
  };

  if (loading) return <div className="p-10 text-center">Verificando credenciales de Admin...</div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600">No tenés permisos para estar acá, pillo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-2">
          <Settings className="text-gray-700" /> Panel de Control Real
        </h1>

        <div className="grid gap-4">
          {partidos.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center md:text-left">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{p.grupo}</span>
                <div className="text-lg font-bold text-gray-800">{p.local} vs {p.visitante}</div>
              </div>

              {p.estado === 'jugado' ? (
                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full">
                  <CheckCircle size={18} /> {p.goles_local} - {p.goles_visitante} (Finalizado)
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="L"
                      id={`l-${p.id}`}
                      className="w-12 h-10 text-center border-2 rounded-lg font-bold"
                    />
                    <span className="font-bold">-</span>
                    <input 
                      type="number" 
                      placeholder="V"
                      id={`v-${p.id}`}
                      className="w-12 h-10 text-center border-2 rounded-lg font-bold"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const l = (document.getElementById(`l-${p.id}`) as HTMLInputElement).value;
                      const v = (document.getElementById(`v-${p.id}`) as HTMLInputElement).value;
                      if(l && v) updateRealScore(p.id, parseInt(l), parseInt(v));
                    }}
                    className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg active:scale-95"
                  >
                    Cargar Resultado
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
