export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div style={{ animation: 'fadeInUp 0.7s ease both' }} className="mb-8 max-w-2xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">{eyebrow}</p>
      <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-base text-slate-300 md:text-lg">{description}</p>}
    </div>
  );
}
