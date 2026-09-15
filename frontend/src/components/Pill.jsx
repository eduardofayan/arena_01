export default function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200">
      {children}
    </span>
  );
}
