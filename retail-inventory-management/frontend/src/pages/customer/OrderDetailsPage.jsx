import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Clock3, MapPin, Package, Truck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';

const stages = ['Pending', 'Confirmed', 'Picking', 'Packed', 'Dispatched', 'Delivered'];
const stageAliases = { Processing: 'Confirmed', Shipped: 'Dispatched', Queued: 'Pending' };
const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/my-orders/${encodeURIComponent(orderId)}`)
      .then((response) => setOrder(response.data.data))
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load order details.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="card p-10 text-sm text-slate-500">Loading order details...</div>;
  if (error || !order) return <div role="alert" className="card p-6 text-sm text-red-700">{error || 'Order not found.'}</div>;

  const currentStage = stages.indexOf(stageAliases[order.status] || order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/my-orders" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"><ArrowLeft size={16} /> Back to my orders</Link>

      <section className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Order details</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">{order.orderId || order._id}</h1>
            <p className="mt-1 text-sm text-slate-500">Placed {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recently'}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{order.status || 'Processing'}</span>
        </div>

        {isCancelled ? (
          <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">This order has been cancelled.</p>
        ) : (
          <div className="mt-8 grid grid-cols-4">
            {stages.map((stage, index) => {
              const complete = currentStage >= index;
              const active = currentStage === index;
              return (
                <div key={stage} className="relative text-center">
                  {index < stages.length - 1 ? <span className={`absolute left-1/2 top-4 h-0.5 w-full ${currentStage > index ? 'bg-emerald-500' : 'bg-slate-200'}`} /> : null}
                  <span className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-full ${complete ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {complete ? <Check size={16} /> : <Clock3 size={15} />}
                  </span>
                  <p className={`mt-2 text-xs sm:text-sm ${active ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>{stage}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-[1fr_18rem]">
        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900"><Package size={18} /> Items</h2>
          <div className="mt-4 divide-y divide-slate-200">
            {(order.items || []).map((item, index) => (
              <div key={`${item.productId || item.product}-${index}`} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div><p className="font-medium text-slate-800">{item.product}</p><p className="mt-1 text-sm text-slate-500">Quantity: {item.quantity}</p></div>
                <p className="text-right text-sm font-semibold text-slate-900">{money(Number(item.unitPrice || 0) * Number(item.quantity || 0))}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-semibold text-slate-900"><span>Order total</span><span>{money(order.totalAmount)}</span></div>
        </section>

        <aside className="space-y-6">
          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900"><MapPin size={18} /> Delivery</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{order.shippingAddress || 'Address not provided'}</p>
            <p className="mt-3 text-sm text-slate-500">Fulfillment: {order.warehouse || 'North Hub'}</p>
          </section>
          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900"><Truck size={18} /> Payment</h2>
            <p className="mt-3 text-sm text-slate-700">{order.paymentMethod || 'Cash on delivery'}</p>
            <p className="mt-1 text-sm text-slate-500">{order.paymentStatus || 'Pending'}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
