export default function StatCard({ label, value, sub, accent = "saffron" }) {
  const accentClass = accent === "chili" ? "text-chili-400" : accent === "sage" ? "text-sage-400" : "text-saffron-400";
  return (
    <div className="rounded-ticket border border-char-800 bg-char-900 p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-char-400">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${accentClass}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-char-400">{sub}</p>}
    </div>
  );
}
