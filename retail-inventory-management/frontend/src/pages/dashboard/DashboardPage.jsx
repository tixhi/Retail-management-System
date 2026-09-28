import { useEffect, useState } from 'react';
import { Activity, ArrowUpRight, Box, CircleDollarSign, PackageCheck, ShieldAlert, Truck, Warehouse } from 'lucide-react';
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
        setData({
          kpis: [
            { title: 'Total Products', value: 248, change: '+12% vs last month', tone: 'blue', icon: Box },
            { title: 'Total Inventory', value: 18420, change: '+8.4% vs last month', tone: 'green', icon: PackageCheck },
            { title: 'Low Stock Items', value: 17, change: '5 critical', tone: 'amber', icon: ShieldAlert },
            { title: 'Pending Orders', value: 42, change: '12 due today', tone: 'red', icon: Activity },
            { title: 'Active Warehouses', value: 3, change: '2 operating at full capacity', tone: 'purple', icon: Warehouse },
            { title: 'Active Suppliers', value: 18, change: '+3 this quarter', tone: 'blue', icon: Truck },
            { title: 'Purchase Orders', value: 24, change: '8 pending approval', tone: 'amber', icon: ArrowUpRight },
            { title: 'Inventory Value', value: '₹27.8L', change: '+₹3.1L this month', tone: 'green', icon: CircleDollarSign },
          ],
          trend: [
            { month: 'Jan', sales: 120000 },
            { month: 'Feb', sales: 145000 },
            { month: 'Mar', sales: 168000 },
            { month: 'Apr', sales: 155000 },
            { month: 'May', sales: 179000 },
            { month: 'Jun', sales: 195000 },
          ],
          inventoryMovement: [
            { name: 'Stock In', value: 420 },
            { name: 'Stock Out', value: 310 },
            { name: 'Transfers', value: 160 },
            { name: 'Adjustments', value: 90 },
          ],
          warehouseDistribution: [
            { name: 'Mumbai', value: 42 },
            { name: 'Bengaluru', value: 33 },
            { name: 'Delhi', value: 25 },
          ],
          topProducts: [
            { name: 'Wireless Mouse', units: 380 },
            { name: 'USB Cable', units: 355 },
            { name: 'Laptop', units: 320 },
            { name: 'Monitor', units: 290 },
            { name: 'Router', units: 240 },
          ],
          recentOrders: [
            { orderId: 'ORD-1042', customer: 'Aarav Retail', total: '₹57,200', status: 'Confirmed' },
            { orderId: 'ORD-1045', customer: 'Karnataka Mart', total: '₹41,800', status: 'Packed' },
            { orderId: 'ORD-1049', customer: 'CityHub', total: '₹21,450', status: 'Shipped' },
          ],
          lowStock: [
            { item: 'Power Bank', warehouse: 'Mumbai', quantity: 8 },
            { item: 'Webcam', warehouse: 'Bengaluru', quantity: 5 },
            { item: 'Printer', warehouse: 'Delhi', quantity: 6 },
          ],
          transactions: [
            { type: 'Stock In', product: 'Headphones', qty: '+40', warehouse: 'Mumbai' },
            { type: 'Transfer', product: 'Keyboard', qty: '-18', warehouse: 'Delhi' },
            { type: 'Adjustment', product: 'Monitor', qty: '+6', warehouse: 'Bengaluru' },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="card p-10 text-sm text-slate-500">Loading dashboard...</div>;
  }
  if (error) return <div role="alert" className="card p-6 text-sm text-red-700">{error}</div>;

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
