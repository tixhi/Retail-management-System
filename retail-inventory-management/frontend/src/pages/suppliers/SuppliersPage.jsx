import useApiCollection from '../../hooks/useApiCollection';

export default function SuppliersPage() {
  const { items: suppliers, loading, error } = useApiCollection('/suppliers');
  if (loading) return <div className="card p-10 text-sm text-slate-500">Loading suppliers...</div>;
  if (error) return <div role="alert" className="card p-6 text-sm text-red-700">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Procurement</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Suppliers</h1>
        </div>
        <button className="btn-primary">Add Supplier</button>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Company</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Contact</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {suppliers.map((supplier) => (
              <tr key={supplier._id}>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{supplier.companyName}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{supplier.contact}</td>
                <td className="px-6 py-4"><span className="badge bg-emerald-100 text-emerald-700">{supplier.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {suppliers.length === 0 ? <p className="px-6 py-8 text-sm text-slate-500">No suppliers have been added.</p> : null}
      </div>
    </div>
  );
}
