import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Sparkles, CalendarDays, Ticket, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Pill from '../components/Pill';
import SectionHeading from '../components/SectionHeading';
import { arenaData } from '../data/sites';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  'Estrutura premium e totalmente pensada para alta performance',
  'Experiência de clube premium e ambiente exclusivo',
  'Eventos, treinos e competição em um só lugar',
];

export default function HomePage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    selected_unit: arenaData[0].slug,
    message: '',
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Não foi possível enviar sua mensagem.');
      }

      setFeedback('Mensagem enviada com sucesso. Nossa equipe entrará em contato em breve.');
      setForm({
        name: '',
        phone: '',
        email: '',
        selected_unit: arenaData[0].slug,
        message: '',
      });
    } catch (error) {
      setFeedback(error.message || 'Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="overflow-hidden">
      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 md:px-8">
        <div className="hero-orb left-10 top-20 h-64 w-64 rounded-full bg-violet-500/50" />
        <div className="hero-orb right-0 top-4 h-72 w-72 rounded-full bg-sky-500/40" />

        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <Pill>Seu lugar preferido</Pill>
            <h1 className="mt-6 max-w-xl text-5xl font-black tracking-[-0.08em] text-white md:text-7xl">
              <span className="text-gradient">Arena01</span> é o seu lugar preferido para praticar futevôlei, beach tennis e vôlei.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Sua experiência premium em Jundiaí, Itatiba e Campinas, com energia, comunidade e alto nível em cada modalidade.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="#captação" className="neon-button inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-white transition hover:scale-[1.02]">
                Agendar visita
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/loja" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:border-violet-400/50 hover:bg-violet-500/10">
                Ver loja
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-300" /> Premium</div>
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-sky-300" /> Eventos</div>
              <div className="flex items-center gap-2"><Ticket className="h-4 w-4 text-emerald-300" /> Comunidade</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
            <div className="glass relative overflow-hidden rounded-[30px] border border-white/10 p-3 shadow-glow">
              <div className="grid-pattern h-[520px] rounded-[22px] bg-[#0a1223] p-4">
                <div className="flex h-full flex-col justify-between rounded-[18px] border border-white/10 bg-gradient-to-br from-violet-500/15 to-sky-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">Performance</span>
                    <span className="text-xs text-emerald-300">+ 12k membros</span>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Quadras Premium</span>
                        <span className="text-violet-200">04</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-violet-500 to-sky-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Unidades</p>
                        <p className="mt-3 text-3xl font-black">3</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Eventos</p>
                        <p className="mt-3 text-3xl font-black">150+</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-violet-400/30 bg-violet-500/10 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-violet-200">Agenda</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span>Treino aberto</span>
                      <span className="font-semibold text-white">Sábado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionHeading
          eyebrow="Por que Arena01"
          title="Uma marca premium desenhada para a cultura esportiva local"
          description="Com tecnologia, conforto e identidade forte, a Arena01 nasceu para conectar pessoas, competição e comunidade em cada unidade."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-[28px] p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-sky-500/25 text-violet-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold text-white">{feature}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="unidades" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <SectionHeading
          eyebrow="Nossas unidades"
          title="Três arenas. Uma experiência premium."
          description="Cada unidade da Arena01 foi pensada para atender diferentes perfis, desde jogadores iniciantes até quem busca alto nível e eventos."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {arenaData.map((arena, index) => (
            <motion.article
              key={arena.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1222]/80 p-5"
            >
              <div className="mb-4 rounded-[20px] bg-gradient-to-br from-violet-500/25 via-slate-900 to-sky-500/20 p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-300">
                  <span>{arena.tag}</span>
                  <MapPin className="h-4 w-4 text-violet-200" />
                </div>
                <h3 className="mt-8 text-2xl font-black text-white">{arena.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{arena.city}</p>
              </div>

              <p className="mt-4 text-slate-300">{arena.description}</p>

              <ul className="mt-5 space-y-3 text-sm text-slate-200">
                {arena.metrics.map((metric) => (
                  <li key={metric} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                    {metric}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="captação" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass rounded-[30px] p-6 md:p-8">
            <SectionHeading
              eyebrow="Captação"
              title="Faça seu contato com a unidade ideal"
              description="Selecione a unidade desejada e nossa equipe responderá com todo o suporte para sua visita, treino ou evento."
            />
            <div className="mt-6 space-y-4 text-slate-300">
              <p>Atendimento rápido, equipe especializada e experiência premium em cada detalhe.</p>
              <p>Ideal para players, empresas, eventos e grupos de alto nível.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-[30px] p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>Nome</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="Seu nome" />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Telefone</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-500" placeholder="(11) 99999-9999" />
              </label>
              <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
                <span>E-mail</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-500" placeholder="seu@email.com" />
              </label>
              <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
                <span>Unidade desejada</span>
                <select value={form.selected_unit} onChange={(e) => setForm({ ...form, selected_unit: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none">
                  {arenaData.map((arena) => (
                    <option key={arena.slug} value={arena.slug}>{arena.name}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
                <span>Mensagem</span>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="4" className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-500" placeholder="Conte-nos seu objetivo..." />
              </label>
            </div>

            {feedback && <p className="mt-4 text-sm text-emerald-300">{feedback}</p>}

            <button type="submit" disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-5 py-3 font-semibold text-white disabled:opacity-60">
              {loading ? 'Enviando...' : 'Enviar mensagem'}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
