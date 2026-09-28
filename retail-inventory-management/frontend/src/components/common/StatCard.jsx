export default function StatCard({ title, value, change, icon: Icon, tone = 'blue' }) {
  const classes = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-violet-50 text-violet-700',
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h3>
        </div>
        <div className={`rounded-xl p-3 ${classes[tone] || classes.blue}`}>
          {Icon ? <Icon size={22} /> : null}
        </div>
      </div>
      {change ? <p className="mt-4 text-xs font-medium text-slate-500">{change}</p> : null}
    </div>
  );
}
