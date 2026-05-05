export default function RatingBadge({ average, count, light = false }: { average: number; count: number; light?: boolean }) {
  if (count === 0) return null; // Don't show anything if no ratings exist
  return (
    <div className={`flex items-center gap-1.5 font-bold ${light ? 'text-white/60' : 'text-primary'}`}>
      <span className="text-yellow-400 text-sm">★</span>
      <span className="text-xs uppercase tracking-tighter">
        {average?.toFixed(1)} <span className="opacity-50">({count})</span>
      </span>
    </div>
  );
};
