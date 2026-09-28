import useApiCollection from '../../hooks/useApiCollection';

export default function PurchaseOrdersPage() {
  const { items: purchaseOrders, loading, error } = useApiCollection('/purchase-orders');
  if (loading) return <div className="card p-10 text-sm text-slate-500">Loading purchase orders...</div>;
  if (error) return <div role="alert" className="card p-6 text-sm text-red-700">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Procurement</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Purchase Orders</h1>
        </div>
        <button className="btn-primary">New Purchase Order</button>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">PO ID</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Supplier</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Total</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {purchaseOrders.map((po) => (
              <tr key={po._id}>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{po.poNumber}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{po.supplier}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(po.totalCost) || 0)}</td>
                <td className="px-6 py-4"><span className="badge bg-blue-100 text-blue-700">{po.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {purchaseOrders.length === 0 ? <p className="px-6 py-8 text-sm text-slate-500">No purchase orders have been added.</p> : null}
      </div>
    </div>
  );
}
