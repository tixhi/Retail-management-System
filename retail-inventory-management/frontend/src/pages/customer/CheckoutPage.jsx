import { useEffect, useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CART_KEY = 'rim_customer_cart';
const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  } catch {
    return {};
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(readCart);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on delivery');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products')
      .then((response) => setProducts(response.data.data || []))
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load checkout items.'))
      .finally(() => setLoading(false));
  }, []);

  const cartItems = products
    .filter((product) => Number(cart[product._id]) > 0)
    .map((product) => ({ ...product, quantity: Number(cart[product._id]) }));
  const total = cartItems.reduce((sum, product) => sum + Number(product.price || 0) * product.quantity, 0);

  const saveCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
  };

  const changeQuantity = (productId, amount) => {
    const nextQuantity = Number(cart[productId] || 0) + amount;
    const nextCart = { ...cart };
    if (nextQuantity < 1) delete nextCart[productId];
    else nextCart[productId] = nextQuantity;
    saveCart(nextCart);
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await api.post('/orders', {
        items: cartItems.map((item) => ({ productId: item._id, quantity: item.quantity })),
        shippingAddress: address.trim(),
        paymentMethod,
      });
      localStorage.removeItem(CART_KEY);
      navigate(`/my-orders/${encodeURIComponent(response.data.data.orderId)}`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="card p-10 text-sm text-slate-500">Loading checkout...</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Customer</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Checkout</h1>
        </div>
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"><ArrowLeft size={16} /> Back to catalog</Link>
      </div>

      {error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      {cartItems.length === 0 ? (
        <div className="card p-10 text-center">
          <ShoppingBag className="mx-auto mb-3 text-slate-400" size={36} />
          <h2 className="text-xl font-semibold text-slate-900">Your cart is empty</h2>
          <p className="mt-2 text-sm text-slate-600">Choose products from the catalog to begin checkout.</p>
          <Link to="/catalog" className="btn-primary mt-5 inline-flex">Browse catalog</Link>
        </div>
      ) : (
        <form onSubmit={submitOrder} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-6">
            <section className="card p-5">
              <h2 className="text-lg font-semibold text-slate-900">Order items</h2>
              <div className="mt-4 divide-y divide-slate-200">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{money(item.price)} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => changeQuantity(item._id, -1)} className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"><Minus size={14} /></button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => changeQuantity(item._id, 1)} className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"><Plus size={14} /></button>
                      <button type="button" aria-label={`Remove ${item.name}`} onClick={() => saveCart(Object.fromEntries(Object.entries(cart).filter(([id]) => id !== item._id)))} className="ml-1 rounded-md p-1.5 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                    </div>
                    <p className="w-24 text-right font-semibold text-slate-900">{money(Number(item.price || 0) * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="card space-y-4 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Delivery and payment</h2>
              <div>
                <label htmlFor="shipping-address" className="mb-2 block text-sm font-medium text-slate-700">Delivery address</label>
                <textarea id="shipping-address" className="input min-h-24 resize-y" value={address} onChange={(event) => setAddress(event.target.value)} required maxLength={500} placeholder="House / street, city, state, postal code" />
              </div>
              <div>
                <label htmlFor="payment-method" className="mb-2 block text-sm font-medium text-slate-700">Payment method</label>
                <select id="payment-method" className="input" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                  <option>Cash on delivery</option>
                  <option>UPI on delivery</option>
                </select>
              </div>
              <p className="text-xs text-slate-500">Customer: {user?.name} · {user?.email}</p>
            </section>
          </div>

          <aside className="card h-fit p-5 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
            <div className="mt-4 flex justify-between text-sm text-slate-600"><span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span><span>{money(total)}</span></div>
            <div className="mt-3 flex justify-between text-sm text-slate-600"><span>Delivery</span><span className="font-medium text-emerald-700">Free</span></div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-between font-semibold text-slate-900"><span>Total</span><span>{money(total)}</span></div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full">{submitting ? 'Placing order...' : 'Place order'}</button>
          </aside>
        </form>
      )}
    </div>
  );
}
