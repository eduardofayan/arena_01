import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { Users, ShoppingBag, MapPinned, LogOut, TrendingUp, Save, PlusCircle } from 'lucide-react';

const emptyProduct = {
  name: '',
  description: '',
  price: '0',
  category: 'Equipamentos',
  image_url: '',
  stock: '0',
};

const defaultContent = {
  badge: 'Seu lugar preferido',
  title: 'Arena01 é o seu lugar preferido para praticar futevôlei, beach tennis e vôlei.',
  description: 'Sua experiência premium em Jundiaí, Itatiba e Campinas, com energia, comunidade e alto nível em cada modalidade.',
  cta_primary: 'Agendar visita',
  cta_secondary: 'Ver loja',
  section_title: 'Uma marca premium desenhada para a cultura esportiva local',
  section_description: 'Com tecnologia, conforto e identidade forte, a Arena01 nasceu para conectar pessoas, competição e comunidade em cada unidade.',
};

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState({ arenas: 0, products: 0, leads: 0 });
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [arenas, setArenas] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [contentForm, setContentForm] = useState(defaultContent);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [arenaData, productData, leadData, contentData] = await Promise.all([
          apiFetch('/admin/arenas'),
          apiFetch('/admin/products'),
          apiFetch('/admin/leads'),
          apiFetch('/admin/home-content').catch(() => null),
        ]);

        setArenas(arenaData);
        setProducts(productData);
        setLeads(leadData);
        if (contentData) {
          setContentForm((prev) => ({ ...prev, ...contentData }));
        }
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

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setSavingProduct(true);
    setNotice('');

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      };

      const created = await apiFetch('/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setProducts((current) => [created, ...current]);
      setProductForm(emptyProduct);
      setNotice('Produto cadastrado com sucesso.');
      setStats((current) => ({ ...current, products: current.products + 1 }));
    } catch (error) {
      setNotice(error.message || 'Não foi possível cadastrar o produto.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleContentSubmit = async (event) => {
    event.preventDefault();
    setSavingContent(true);
    setNotice('');

    try {
      const content = await apiFetch('/admin/home-content', {
        method: 'POST',
        body: JSON.stringify(contentForm),
      });

      setContentForm((prev) => ({ ...prev, ...content }));
      setNotice('Texto da home atualizado com sucesso.');
    } catch (error) {
      setNotice(error.message || 'Não foi possível atualizar o texto da home.');
    } finally {
      setSavingContent(false);
    }
  };

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

      {notice && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </div>
      )}

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

      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={handleProductSubmit} className="glass rounded-[28px] p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <PlusCircle className="h-5 w-5 text-violet-200" />
            <h3 className="text-xl font-bold">Cadastrar produto</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
              <span>Nome</span>
              <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" placeholder="Bola oficial Arena01" />
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
              <span>Descrição</span>
              <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" placeholder="Detalhes do produto" />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              <span>Preço</span>
              <input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              <span>Estoque</span>
              <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              <span>Categoria</span>
              <input value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              <span>Imagem</span>
              <input value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" placeholder="https://..." />
            </label>
          </div>

          <button type="submit" disabled={savingProduct} className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white disabled:opacity-60">
            <Save className="h-4 w-4" />
            {savingProduct ? 'Salvando...' : 'Salvar produto'}
          </button>
        </form>

        <form onSubmit={handleContentSubmit} className="glass rounded-[28px] p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-sky-200" />
            <h3 className="text-xl font-bold">Conteúdo da home</h3>
          </div>

          <div className="space-y-4">
            <label className="block text-sm text-slate-200">
              <span className="mb-2 block">Badge</span>
              <input value={contentForm.badge} onChange={(e) => setContentForm({ ...contentForm, badge: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
            </label>

            <label className="block text-sm text-slate-200">
              <span className="mb-2 block">Título</span>
              <textarea value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
            </label>

            <label className="block text-sm text-slate-200">
              <span className="mb-2 block">Descrição</span>
              <textarea value={contentForm.description} onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-slate-200">
                <span className="mb-2 block">CTA primária</span>
                <input value={contentForm.cta_primary} onChange={(e) => setContentForm({ ...contentForm, cta_primary: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
              </label>

              <label className="block text-sm text-slate-200">
                <span className="mb-2 block">CTA secundária</span>
                <input value={contentForm.cta_secondary} onChange={(e) => setContentForm({ ...contentForm, cta_secondary: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
              </label>
            </div>

            <label className="block text-sm text-slate-200">
              <span className="mb-2 block">Título da seção</span>
              <textarea value={contentForm.section_title} onChange={(e) => setContentForm({ ...contentForm, section_title: e.target.value })} rows="2" className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
            </label>

            <label className="block text-sm text-slate-200">
              <span className="mb-2 block">Descrição da seção</span>
              <textarea value={contentForm.section_description} onChange={(e) => setContentForm({ ...contentForm, section_description: e.target.value })} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" />
            </label>
          </div>

          <button type="submit" disabled={savingContent} className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-3 font-semibold text-white disabled:opacity-60">
            <Save className="h-4 w-4" />
            {savingContent ? 'Salvando...' : 'Salvar conteúdo'}
          </button>
        </form>
      </div>
    </div>
  );
}
