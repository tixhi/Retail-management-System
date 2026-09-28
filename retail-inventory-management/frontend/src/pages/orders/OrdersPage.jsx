import { useState } from 'react';
import useApiCollection from '../../hooks/useApiCollection';

export default function OrdersPage() {
  const { items: orders, loading, error } = useApiCollection('/orders');
  const [search, setSearch] = useState('');
  const filteredOrders = orders.filter((order) => `${order.orderId} ${order.customer}`.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="card p-10 text-sm text-slate-500">Loading orders...</div>;
  if (error) return <div role="alert" className="card p-6 text-sm text-red-700">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Commercial</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Orders</h1>
        </div>
        <button className="btn-primary">Create Order</button>
      </div>

      <div className="card p-4">
        <div className="relative max-w-md">
          <input className="input pl-9" placeholder="Search orders or customer" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-xs uppercase tracking-[0.1em] text-slate-500">Order ID</th>
                <th className="px-6 py-3 text-xs uppercase tracking-[0.1em] text-slate-500">Customer</th>
                <th className="px-6 py-3 text-xs uppercase tracking-[0.1em] text-slate-500">Warehouse</th>
                <th className="px-6 py-3 text-xs uppercase tracking-[0.1em] text-slate-500">Total</th>
                <th className="px-6 py-3 text-xs uppercase tracking-[0.1em] text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{order.orderId}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.warehouse}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(order.totalAmount) || 0)}</td>
                  <td className="px-6 py-4"><span className="badge bg-emerald-100 text-emerald-700">{order.status}</span></td>
                </tr>
              ))}
              {filteredOrders.length === 0 ? <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">No orders found.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
