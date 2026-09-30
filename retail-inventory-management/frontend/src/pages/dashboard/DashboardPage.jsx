import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';

const palette = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/reports/dashboard')
      .then((response) => setData(response.data.data))
      .catch((requestError) => {
        setError(requestError?.response?.data?.message || 'Could not load live dashboard data. Check the API and database connection.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card p-10 text-sm text-slate-500">Loading dashboard...</div>;
  if (error) return <div role="alert" className="card p-6 text-sm text-red-700">{error}</div>;
  if (!data) return <div className="card p-6 text-sm text-slate-500">No dashboard data is available.</div>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Executive overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} change={item.change} icon={item.icon} tone={item.tone} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Sales trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Inventory movement</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.inventoryMovement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {data.inventoryMovement.map((entry, index) => (
                    <Cell key={entry.name} fill={palette[index % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Warehouse distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.warehouseDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={3}>
                  {data.warehouseDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5 xl:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Top-selling products</h3>
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">{index + 1}</div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{product.name}</p>
                </div>
                <div className="text-sm text-slate-500">{product.units} units</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Orders</h3>
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <div key={order.orderId} className="rounded-lg border border-slate-200 p-3">
                <div className="flex justify-between">
                  <p className="font-medium text-slate-800">{order.orderId}</p>
                  <span className="badge bg-emerald-100 text-emerald-700">{order.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{order.customer}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{order.total}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Inventory Transactions</h3>
          <div className="space-y-3">
            {data.transactions.map((transaction) => (
              <div key={`${transaction.type}-${transaction.product}`} className="rounded-lg border border-slate-200 p-3">
                <div className="flex justify-between">
                  <p className="font-medium text-slate-800">{transaction.type}</p>
                  <p className="font-semibold text-slate-900">{transaction.qty}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">{transaction.product}</p>
                <p className="mt-1 text-xs text-slate-500">{transaction.warehouse}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Low Stock Alerts</h3>
          <div className="space-y-3">
            {data.lowStock.map((item) => (
              <div key={`${item.item}-${item.warehouse}`} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="font-medium text-slate-800">{item.item}</p>
                <p className="mt-1 text-sm text-slate-600">{item.warehouse}</p>
                <p className="mt-1 text-sm font-medium text-amber-700">Qty left: {item.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
