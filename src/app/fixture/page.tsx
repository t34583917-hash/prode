'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, User, LogIn } from 'lucide-react';

export default function Fixture() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [predicciones, setPredicciones] = useState<Record<string, any>>({});

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const { data: preds } = await supabase
          .from('predicciones')
          .select('*')
          .eq('user_id', session.user.id);
        
        const predsMap: Record<string, any> = {};
        preds?.forEach(p => {
          predsMap[p.partido_id] = { local: p.goles_local, visitante: p.goles_visitante };
        });
        setPredicciones(predsMap);
      }
    };

    const fetchPartidos = async () => {
      const { data } = await supabase.from('partidos').select('*').order('grupo', { ascending: true });
      setPartidos(data || []);
      setLoading(false);
    };

    checkUser();
    fetchPartidos();
  }, []);

  const handleInputChange = (partidoId: number, side: 'local' | 'visitante', value: string) => {
    setPredicciones(prev => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        [side]: parseInt(value) || 0
      }
    }));
  };

  const savePrediction = async (partidoId: number) => {
    if (!user) return alert('Debes iniciar sesión para guardar');
    const pred = predicciones[partidoId];
    
    const { error } = await supabase.from('predicciones').upsert({
      user_id: user.id,
      partido_id: partidoId,
      goles_local: pred.local,
      goles_visitante: pred.visitante,
    }, { onConflict: 'user_id,partido_id' });

    if (error) alert('Error: ' + error.message);
    else alert('Predicción guardada correctamente');
  };

  const login = async () => {
    // Para simplificar usamos el login de prueba o podés configurar Google en Supabase
    const email = prompt('Email:');
    const password = prompt('Password:');
    if (email && password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Si no existe, intentamos registrarlo
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) alert(signUpError.message);
        else alert('Cuenta creada! Iniciá sesión.');
      } else {
        window.location.reload();
      }
    }
  };

  if (loading) return <div className="p-10 text-center text-white">Cargando Mundial...</div>;

  // Agrupar por grupo
  const grupos = partidos.reduce((acc: any, p) => {
    if (!acc[p.grupo]) acc[p.grupo] = [];
    acc[p.grupo].push(p);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-blue-900 text-white p-6 shadow-lg mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-400" /> Mi Prode 2026
          </h1>
          {user ? (
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
              <User size={18} />
              <span className="text-sm font-medium">{user.email}</span>
            </div>
          ) : (
            <button onClick={login} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-4 py-2 rounded-lg font-bold transition">
              <LogIn size={18} /> Ingresar
            </button>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {Object.keys(grupos).sort().map(grupo => (
          <section key={grupo}>
            <h2 className="text-xl font-black text-gray-800 mb-4 border-l-4 border-yellow-500 pl-3">
              GRUPO {grupo}
            </h2>
            <div className="grid gap-3">
              {grupos[grupo].map((p: any) => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1 text-right font-bold text-gray-700">{p.local}</div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <input 
                      type="number" 
                      value={predicciones[p.id]?.local ?? ''}
                      onChange={(e) => handleInputChange(p.id, 'local', e.target.value)}
                      className="w-12 h-10 text-center text-lg font-bold border-2 border-gray-200 rounded-md focus:border-blue-500 outline-none"
                    />
                    <span className="text-gray-400 font-bold">X</span>
                    <input 
                      type="number" 
                      value={predicciones[p.id]?.visitante ?? ''}
                      onChange={(e) => handleInputChange(p.id, 'visitante', e.target.value)}
                      className="w-12 h-10 text-center text-lg font-bold border-2 border-gray-200 rounded-md focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex-1 text-left font-bold text-gray-700">{p.visitante}</div>
                  <button 
                    onClick={() => savePrediction(p.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
                  >
                    Guardar
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
