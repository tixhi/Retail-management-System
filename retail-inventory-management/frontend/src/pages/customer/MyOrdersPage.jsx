import { useEffect, useState } from 'react';
import { ArrowRight, PackageCheck, Truck } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const statusStyles = {
  Queued: 'bg-slate-100 text-slate-700',
  Processing: 'bg-blue-100 text-blue-700',
  Packed: 'bg-violet-100 text-violet-700',
  Shipped: 'bg-amber-100 text-amber-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/my-orders')
      .then((response) => setOrders(response.data.data || []))
      .catch((err) => setError(err?.response?.data?.message || 'Unable to fetch your orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="card p-10 text-sm text-slate-500">Loading your orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Customer</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">My Orders</h1>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600">
          {user?.name || 'Customer User'}
        </div>
      </div>

      {error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      {orders.length === 0 ? (
        <div className="card p-10 text-center">
          <PackageCheck className="mx-auto mb-3 text-slate-400" size={36} />
          <h2 className="text-xl font-semibold text-slate-900">No orders yet</h2>
          <p className="mt-2 text-sm text-slate-600">Your recent purchases will show up here once you place an order from the catalog.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-5">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Order ID</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{order.orderId || order._id}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || 'bg-slate-100 text-slate-700'}`}>
                  {order.status || 'Queued'}
                </span>
              </div>

              <div className="mt-4 grid gap-5 md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Items</p>
                  <p className="mt-2 text-sm text-slate-700">
                    {(order.items && order.items.length > 0)
                      ? order.items.map((item) => `${item.product} x${item.quantity}`).join(', ')
                      : (order.product ? `${order.product} x${order.quantity || 1}` : 'Catalog order')}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Warehouse</p>
                  <p className="mt-2 text-sm text-slate-700">{order.warehouse || 'North Hub'}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <Truck size={16} className="text-blue-600" />
                Tracking status: <span className="font-semibold text-slate-900">{order.status || 'Queued'}</span>
              </div>
              <Link to={`/my-orders/${encodeURIComponent(order.orderId || order._id)}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
                View order details <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
