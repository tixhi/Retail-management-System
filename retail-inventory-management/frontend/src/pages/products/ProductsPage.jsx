import { useEffect, useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import api from '../../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    api
      .get('/products')
      .then((response) => setProducts(response.data.data || []))
      .catch((err) => setError(err?.response?.data?.message || 'Could not load products from the server.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="card p-10 text-sm text-slate-500">Loading products...</div>;
  }
  if (error) return <div role="alert" className="card p-6 text-sm text-red-700">{error}</div>;

  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))].sort();
  const statuses = [...new Set(products.map((product) => product.status).filter(Boolean))].sort();
  const filteredProducts = products.filter((product) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${product.name} ${product.sku}`.toLowerCase().includes(term);
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const hasFilters = Boolean(search || categoryFilter || statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Products</h1>
        </div>
        <button className="btn-primary"><Plus size={16} className="mr-2" /> Add Product</button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search size={16} className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search products or SKU"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn-secondary"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <SlidersHorizontal size={16} className="mr-2" /> Filters
          </button>
        </div>
        {filtersOpen ? (
          <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <label htmlFor="product-category" className="mb-2 block text-sm font-medium text-slate-700">Category</label>
              <select id="product-category" className="input" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                <option value="">All categories</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="product-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select id="product-status" className="input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">All statuses</option>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <button
              type="button"
              className="btn-secondary"
              disabled={!hasFilters}
              onClick={() => {
                setSearch('');
                setCategoryFilter('');
                setStatusFilter('');
              }}
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Product</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">SKU</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Category</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Price</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4"><p className="font-medium text-slate-900">{product.name}</p></td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">₹{Number(product.price || 0).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${product.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">No products match these filters.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
