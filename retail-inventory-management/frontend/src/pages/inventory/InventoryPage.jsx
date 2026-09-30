import { useEffect, useState } from 'react';
import { ArrowRightLeft, Download, Plus } from 'lucide-react';
import api from '../../services/api';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/inventory'), api.get('/warehouses')])
      .then(([inventoryResponse, warehouseResponse]) => {
        setInventory(inventoryResponse.data.data || []);
        setWarehouses(warehouseResponse.data.data || []);
      })
      .catch((err) => setError(err?.response?.data?.message || 'Could not load inventory from the server.'))
      .finally(() => setLoading(false));
  }, []);

  const refreshInventory = async () => {
    const response = await api.get('/inventory');
    setInventory(response.data.data || []);
  };

  const submitStockAction = async (event) => {
    event.preventDefault();
    setSaving(true);
    setActionError('');
    const values = Object.fromEntries(new FormData(event.currentTarget));

    try {
      if (action === 'adjust') {
        await api.post('/inventory/adjust', {
          productId: values.productId,
          warehouseId: values.warehouseId,
          quantity: Number(values.quantity),
          reason: values.reason,
        });
      } else {
        const source = inventory.find((row) => row._id === values.sourceInventoryId);
        const destination = warehouses.find((warehouse) => warehouse._id === values.destinationWarehouseId);
        if (!source || !destination) throw new Error('Select a valid source and destination warehouse.');
        await api.post('/inventory/transfer', {
          productId: source.productId,
          sourceWarehouseId: source.warehouseId,
          destinationWarehouseId: destination._id,
          destinationWarehouseName: destination.name,
          quantity: Number(values.quantity),
        });
      }
      await refreshInventory();
      setAction('');
    } catch (requestError) {
      setActionError(requestError?.response?.data?.message || requestError.message || 'Stock operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const exportInventory = () => {
    const columns = ['Product', 'Warehouse', 'Current stock', 'Available stock', 'Reserved stock', 'Status'];
    const rows = inventory.map((row) => [row.productName, row.warehouseName, row.currentStock, row.availableStock, row.reservedStock, row.stockStatus]);
    const csv = [columns, ...rows].map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

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
          <button type="button" className="btn-secondary" onClick={() => { setAction(action === 'transfer' ? '' : 'transfer'); setActionError(''); }}><ArrowRightLeft size={16} className="mr-2" /> Transfer Stock</button>
          <button type="button" className="btn-primary" onClick={() => { setAction(action === 'adjust' ? '' : 'adjust'); setActionError(''); }}><Plus size={16} className="mr-2" /> Adjust Stock</button>
        </div>
      </div>

      {action ? (
        <form onSubmit={submitStockAction} className="card space-y-4 p-5">
          <h2 className="text-lg font-semibold text-slate-900">{action === 'adjust' ? 'Adjust stock' : 'Transfer stock'}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {action === 'adjust' ? (
              <>
                <div>
                  <label htmlFor="adjust-product" className="mb-2 block text-sm font-medium text-slate-700">Product</label>
                  <select id="adjust-product" name="productId" className="input" required>
                    <option value="">Select product</option>
                    {[...new Map(inventory.map((row) => [row.productId, row.productName]))].map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="adjust-warehouse" className="mb-2 block text-sm font-medium text-slate-700">Warehouse</label>
                  <select id="adjust-warehouse" name="warehouseId" className="input" required>
                    <option value="">Select warehouse</option>
                    {warehouses.map((warehouse) => <option key={warehouse._id} value={warehouse._id}>{warehouse.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="adjust-quantity" className="mb-2 block text-sm font-medium text-slate-700">Quantity change</label>
                  <input id="adjust-quantity" name="quantity" type="number" step="1" className="input" required />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label htmlFor="adjust-reason" className="mb-2 block text-sm font-medium text-slate-700">Reason</label>
                  <input id="adjust-reason" name="reason" className="input" placeholder="Count correction, damaged stock, opening balance" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="transfer-source" className="mb-2 block text-sm font-medium text-slate-700">Product and source</label>
                  <select id="transfer-source" name="sourceInventoryId" className="input" required>
                    <option value="">Select source stock</option>
                    {inventory.map((row) => <option key={row._id} value={row._id}>{row.productName} · {row.warehouseName} ({row.availableStock} available)</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="transfer-destination" className="mb-2 block text-sm font-medium text-slate-700">Destination warehouse</label>
                  <select id="transfer-destination" name="destinationWarehouseId" className="input" required>
                    <option value="">Select warehouse</option>
                    {warehouses.map((warehouse) => <option key={warehouse._id} value={warehouse._id}>{warehouse.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="transfer-quantity" className="mb-2 block text-sm font-medium text-slate-700">Quantity</label>
                  <input id="transfer-quantity" name="quantity" type="number" min="1" step="1" className="input" required />
                </div>
              </>
            )}
          </div>
          {actionError ? <p role="alert" className="text-sm text-red-700">{actionError}</p> : null}
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setAction('')} disabled={saving}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : action === 'adjust' ? 'Save adjustment' : 'Transfer stock'}</button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-slate-500">Current stock</p><h3 className="mt-2 text-2xl font-semibold">{stockTotal.toLocaleString('en-IN')}</h3></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Low stock locations</p><h3 className="mt-2 text-2xl font-semibold text-amber-600">{lowStockCount}</h3></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Tracked product locations</p><h3 className="mt-2 text-2xl font-semibold text-emerald-600">{inventory.length.toLocaleString('en-IN')}</h3></div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-900">Inventory by warehouse</h2>
          <button type="button" className="btn-secondary" onClick={exportInventory}><Download size={16} className="mr-2" /> Export</button>
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
