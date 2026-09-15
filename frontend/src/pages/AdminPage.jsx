import { useState } from 'react';
import { Lock, LogIn, Database, LayoutDashboard, Users, ShoppingBag } from 'lucide-react';
import { apiFetch } from '../lib/api';
import AdminDashboard from '../components/AdminDashboard';

const adminModules = [
  { icon: LayoutDashboard, label: 'Conteúdo', description: 'Atualizar páginas e textos.', accent: 'from-violet-500/20 to-sky-500/10' },
  { icon: Database, label: 'Arenas', description: 'Gerenciar unidades e contatos.', accent: 'from-sky-500/20 to-violet-500/10' },
  { icon: ShoppingBag, label: 'Produtos', description: 'Controle de catálogo e estoque.', accent: 'from-emerald-500/20 to-violet-500/10' },
  { icon: Users, label: 'Leads', description: 'Visualizar captação e atendimento.', accent: 'from-fuchsia-500/20 to-sky-500/10' },
];

export default function AdminPage() {
  const [email, setEmail] = useState('viniciusfayan@gmail.com');
  const [password, setPassword] = useState('Arena01@2026');
  const [token, setToken] = useState(localStorage.getItem('arena01_token') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);

      const payload = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });

      if (!payload.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await payload.json();
      localStorage.setItem('arena01_token', data.access_token);
      setToken(data.access_token);
    } catch (err) {
      setError(err.message || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('arena01_token');
    setToken('');
  };

  if (token) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="glass rounded-[30px] p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3 text-violet-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Admin</p>
              <h1 className="text-3xl font-black text-white">Área protegida</h1>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm text-slate-200">
              <span className="mb-2 block">E-mail</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
            </label>
            <label className="block text-sm text-slate-200">
              <span className="mb-2 block">Senha</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
            </label>

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <button onClick={handleLogin} disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white disabled:opacity-60">
              <LogIn className="h-4 w-4" />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </section>

        <section className="glass rounded-[30px] p-6 md:p-8">
          <h2 className="text-2xl font-black text-white">Gerenciamento</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {adminModules.map(({ icon: Icon, label, description, accent }) => (
              <div key={label} className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${accent} p-4`}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/50 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{label}</h3>
                <p className="mt-2 text-sm text-slate-200">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
