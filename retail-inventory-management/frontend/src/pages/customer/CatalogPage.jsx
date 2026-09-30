import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CART_KEY = 'rim_customer_cart';

export default function CatalogPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const [cartCount, setCartCount] = useState(() => {
    try {
      return Object.values(JSON.parse(localStorage.getItem(CART_KEY) || '{}')).reduce((sum, quantity) => sum + quantity, 0);
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    api
      .get('/products')
      .then((response) => setProducts(response.data.data || []))
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load the catalog right now.'))
      .finally(() => setLoading(false));
  }, []);

  const updateQuantity = (productId, value) => {
    setQuantities((current) => ({
      ...current,
      [productId]: Math.max(1, Number(value) || 1),
    }));
  };

  const addToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    let cart = {};
    try {
      cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
    } catch {
      cart = {};
    }
    cart[product._id] = (Number(cart[product._id]) || 0) + quantity;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    setCartCount(Object.values(cart).reduce((sum, itemQuantity) => sum + itemQuantity, 0));
    setQuantities((current) => ({ ...current, [product._id]: 1 }));
  };

  if (loading) {
    return <div className="card p-10 text-sm text-slate-500">Loading catalog...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Customer</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Catalog</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
          <Sparkles size={14} /> Welcome, {user?.name || 'Customer'}
        </div>
      </div>

      {error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product._id} className="card overflow-hidden p-0">
            <div className="h-44 overflow-hidden bg-slate-100">
              <img
                src={product.image || product.picture || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{product.category || 'General'}</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">{product.name}</h2>
                </div>
                <span className={`badge ${product.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {product.status || 'In Stock'}
                </span>
              </div>

              <p className="text-sm text-slate-600">{product.description || 'Ready for immediate delivery.'}</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Price</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">₹{Number(product.price || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                  <label htmlFor={`qty-${product._id}`} className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Qty</label>
                  <input
                    id={`qty-${product._id}`}
                    type="number"
                    min="1"
                    value={quantities[product._id] || 1}
                    onChange={(event) => updateQuantity(product._id, event.target.value)}
                    className="w-14 border-none bg-transparent text-right text-sm font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => addToCart(product)}
                className="btn-primary flex w-full items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        onClick={() => navigate('/checkout')}
        className="fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white shadow-xl hover:bg-slate-800"
      >
        <ShoppingCart size={18} /> Checkout <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-900">{cartCount}</span>
      </button>
    </div>
  );
}
