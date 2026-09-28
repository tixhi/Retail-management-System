import { useEffect, useState } from 'react';
import { ArrowRightLeft, Download, Plus } from 'lucide-react';
import api from '../../services/api';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/inventory')
      .then((response) => setInventory(response.data.data || []))
      .catch((err) => setError(err?.response?.data?.message || 'Could not load inventory from the server.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="card p-10 text-sm text-slate-500">Loading inventory...</div>;
  }
  if (error) return <div role="alert" className="card p-6 text-sm text-red-700">{error}</div>;

  const stockTotal = inventory.reduce((sum, row) => sum + (Number(row.currentStock) || 0), 0);
  const lowStockCount = inventory.filter((row) => Number(row.availableStock) <= Number(row.reorderLevel)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Operations</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Inventory</h1>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary"><ArrowRightLeft size={16} className="mr-2" /> Transfer Stock</button>
          <button className="btn-primary"><Plus size={16} className="mr-2" /> Adjust Stock</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-slate-500">Current stock</p><h3 className="mt-2 text-2xl font-semibold">{stockTotal.toLocaleString('en-IN')}</h3></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Low stock locations</p><h3 className="mt-2 text-2xl font-semibold text-amber-600">{lowStockCount}</h3></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Tracked product locations</p><h3 className="mt-2 text-2xl font-semibold text-emerald-600">{inventory.length.toLocaleString('en-IN')}</h3></div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-900">Inventory by warehouse</h2>
          <button className="btn-secondary"><Download size={16} className="mr-2" /> Export</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Product</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Available</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Reserved</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.1em] text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {inventory.map((row) => (
                <tr key={row._id}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{row.productName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.warehouseName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.availableStock}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.reservedStock}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${row.stockStatus === 'Low Stock' ? 'bg-amber-100 text-amber-700' : row.stockStatus === 'Out of Stock' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {row.stockStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
