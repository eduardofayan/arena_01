import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { Users, ShoppingBag, MapPinned, LogOut, TrendingUp } from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState({ arenas: 0, products: 0, leads: 0 });
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [arenas, setArenas] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [arenaData, productData, leadData] = await Promise.all([
          apiFetch('/admin/arenas'),
          apiFetch('/admin/products'),
          apiFetch('/admin/leads'),
        ]);

        setArenas(arenaData);
        setProducts(productData);
        setLeads(leadData);
        setStats({
          arenas: arenaData.length,
          products: productData.length,
          leads: leadData.length,
        });
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Dashboard</p>
          <h2 className="mt-2 text-3xl font-black text-white">Gestão Arena01</h2>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Arenas', value: stats.arenas, icon: MapPinned },
          { label: 'Produtos', value: stats.products, icon: ShoppingBag },
          { label: 'Leads', value: stats.leads, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-[24px] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">{label}</p>
              <Icon className="h-5 w-5 text-violet-200" />
            </div>
            <p className="mt-6 text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-[28px] p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-violet-200" />
            <h3 className="text-xl font-bold">Leads captados</h3>
          </div>
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{lead.name}</p>
                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-200">{lead.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-300">{lead.email}</p>
                <p className="mt-1 text-xs text-slate-400">{lead.selected_unit}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-[28px] p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <ShoppingBag className="h-5 w-5 text-sky-200" />
            <h3 className="text-xl font-bold">Produtos</h3>
          </div>
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                <div>
                  <p className="font-semibold text-white">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.category}</p>
                </div>
                <span className="text-sm font-semibold text-violet-200">R$ {Number(product.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
