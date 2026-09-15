import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const menu = [
  { label: 'Home', to: '/' },
  { label: 'Unidades', to: '#unidades' },
  { label: 'Loja', to: '/loja' },
  { label: 'Admin', to: '/admin' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#c71464]/50 bg-[#090909]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-[#30999d] via-[#8d80ad] to-[#c71464] text-lg font-black text-white shadow-glow" style={{ clipPath: 'polygon(36% 0, 100% 0, 100% 100%, 0 100%, 0 62%)' }}>
            01
          </div>
          <div>
            <div className="brand-wordmark text-2xl font-black leading-none">arena<sup className="ml-0.5 text-[10px] text-[#30999d]">01</sup></div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">Futevôlei • Beach Tennis • Vôlei</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {menu.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 md:inline-flex">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Área Administrativa
          </button>
          <Link
            to="/#captação"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#30999d] to-[#c71464] px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
          >
            Fale com a gente
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
