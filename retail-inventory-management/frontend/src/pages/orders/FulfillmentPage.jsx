import { useState } from 'react';
import api from '../../services/api';
import useApiCollection from '../../hooks/useApiCollection';

const steps = ['Pending', 'Confirmed', 'Picking', 'Packed', 'Dispatched', 'Delivered'];

export default function FulfillmentPage() {
  const { items: orders, loading, error: loadError, setItems } = useApiCollection('/orders');
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  const advanceOrder = async (order) => {
    const currentStep = steps.indexOf(order.fulfillmentStatus || order.status);
    const nextStatus = steps[currentStep + 1];
    if (!nextStatus) return;

    setUpdatingId(order._id);
    setError('');
    try {
      const response = await api.patch(`/orders/${order.orderId || order._id}/status`, { status: nextStatus });
      setItems((items) => items.map((item) => item._id === order._id ? response.data.data : item));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Could not update order status.');
    } finally {
      setUpdatingId('');
    }
  };

  if (loading) return <div className="card p-10 text-sm text-slate-500">Loading fulfillment orders...</div>;
  if (loadError) return <div role="alert" className="card p-6 text-sm text-red-700">{loadError}</div>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Warehouse workflow</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Order Fulfillment</h1>
      </div>
      {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {orders.map((order) => {
        const status = order.fulfillmentStatus || order.status;
        const currentStep = steps.indexOf(status);
        return (
          <section key={order._id} className="card p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500">{order.customer}</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">{order.orderId}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge bg-blue-100 text-blue-700">{status}</span>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={currentStep < 0 || currentStep >= steps.length - 1 || updatingId === order._id}
                  onClick={() => advanceOrder(order)}
                >
                  {updatingId === order._id ? 'Updating...' : 'Advance status'}
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {steps.map((step, index) => (
                <div key={step} className={`rounded-lg border p-3 text-center ${index <= currentStep ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                  <p className="text-xs uppercase tracking-[0.12em]">Step {index + 1}</p>
                  <p className="mt-2 font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {orders.length === 0 ? <div className="card p-8 text-sm text-slate-500">No orders are ready for fulfillment.</div> : null}
    </div>
  );
}
