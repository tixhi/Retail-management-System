import { Download, FileBarChart, Package, TrendingUp } from 'lucide-react';

const reports = [
  { title: 'Sales Summary', description: 'Revenue, order volume, and sales trends', icon: TrendingUp, updated: 'Today' },
  { title: 'Inventory Valuation', description: 'Current stock value by product and warehouse', icon: Package, updated: 'Today' },
  { title: 'Operations Overview', description: 'Stock movement, fulfillment, and low-stock activity', icon: FileBarChart, updated: 'Yesterday' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Business intelligence</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Reports</h1>
        </div>
        <button type="button" className="btn-secondary">
          <Download size={16} className="mr-2" /> Export summary
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {reports.map(({ title, description, icon: Icon, updated }) => (
          <section key={title} className="card p-5">
            <div className="flex items-start justify-between">
              <span className="rounded-lg bg-blue-50 p-2 text-blue-700"><Icon size={20} /></span>
              <span className="text-xs text-slate-500">Updated {updated}</span>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 min-h-10 text-sm text-slate-600">{description}</p>
            <button type="button" className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-800">
              View report <span aria-hidden="true">-&gt;</span>
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}
