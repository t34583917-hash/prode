import Link from 'next/link';
import { Trophy, Users, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white">
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight">
          Prode <span className="text-yellow-400">Mundial 2026</span>
        </h1>
        <p className="text-xl mb-12 text-blue-100">
          Predecí los resultados, competí con tus amigos y demostrá quién sabe más de fútbol.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="/fixture" className="group p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition text-left">
            <Trophy className="w-12 h-12 text-yellow-400 mb-4 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-bold mb-2">Completar Fixture</h2>
            <p className="text-blue-200">Cargá tus pronósticos para los partidos de la fase de grupos.</p>
          </Link>
          <Link href="/ranking" className="group p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition text-left">
            <Users className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-bold mb-2">Ver Ranking</h2>
            <p className="text-blue-200">Mirá cómo vas en la tabla general respecto a tus amigos.</p>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <Shield className="w-4 h-4" /> Powered by Supabase & Next.js
          </div>
        </div>
      </main>
    </div>
  );
}
