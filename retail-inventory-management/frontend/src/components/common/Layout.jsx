import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Building2,
  Boxes,
  ChartColumnBig,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  Truck,
  Warehouse,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Management', 'Inventory Manager', 'Sales Staff', 'Procurement Manager', 'Warehouse Staff', 'Customer'] },
  { label: 'Catalog', to: '/catalog', icon: Package, roles: ['Customer'] },
  { label: 'Checkout', to: '/checkout', icon: CreditCard, roles: ['Customer'] },
  { label: 'My Orders', to: '/my-orders', icon: ClipboardList, roles: ['Customer'] },
  { label: 'Products', to: '/products', icon: Package, roles: ['Admin', 'Inventory Manager'] },
  { label: 'Inventory', to: '/inventory', icon: Boxes, roles: ['Admin', 'Inventory Manager', 'Warehouse Staff'] },
  { label: 'Warehouses', to: '/warehouses', icon: Warehouse, roles: ['Admin', 'Inventory Manager'] },
  { label: 'Orders', to: '/orders', icon: ClipboardList, roles: ['Admin', 'Sales Staff', 'Warehouse Staff'] },
  { label: 'Suppliers', to: '/suppliers', icon: Truck, roles: ['Admin', 'Procurement Manager'] },
  { label: 'Purchase Orders', to: '/purchase-orders', icon: Building2, roles: ['Admin', 'Procurement Manager'] },
  { label: 'Reports', to: '/reports', icon: ChartColumnBig, roles: ['Admin', 'Management', 'Inventory Manager'] },
  { label: 'Fulfillment', to: '/fulfillment', icon: ShieldCheck, roles: ['Admin', 'Warehouse Staff'] },
  { label: 'Settings', to: '/settings', icon: Settings, roles: ['Admin', 'Management'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'stock-alert', title: 'Low stock items need attention', detail: '17 products are below their reorder level.', to: '/inventory', unread: true },
    { id: 'orders-queue', title: 'Orders awaiting fulfillment', detail: '12 orders are due to be processed today.', to: '/fulfillment', unread: true },
    { id: 'purchase-approvals', title: 'Purchase orders need review', detail: '8 purchase orders are pending approval.', to: '/purchase-orders', unread: true },
  ]);

  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role));
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell flex min-h-screen bg-slate-100 text-slate-800">
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-slate-950 text-slate-100 transition lg:translate-x-0`}>
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Retail</p>
            <h1 className="text-lg font-semibold">Inventory Hub</h1>
          </div>
          <button className="rounded-lg p-2 text-slate-300 lg:hidden" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {visibleItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 md:px-7">
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-slate-200 p-2 lg:hidden" onClick={() => setSidebarOpen(true)}>☰</button>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Operations</p>
                <h2 className="text-lg font-semibold text-slate-900">Retail Command Center</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                  aria-expanded={notificationsOpen}
                  className="relative rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
                  onClick={() => setNotificationsOpen((open) => !open)}
                >
                  <Bell size={18} />
                  {unreadCount > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-900">
                      {unreadCount}
                    </span>
                  ) : null}
                </button>

                {notificationsOpen ? (
                  <section aria-label="Notifications" className="absolute right-0 top-12 z-50 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <p className="text-xs text-slate-500">{unreadCount} unread</p>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-semibold text-blue-700 hover:text-blue-800 disabled:text-slate-400"
                        disabled={unreadCount === 0}
                        onClick={() => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))}
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                          onClick={() => {
                            setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, unread: false } : item));
                            setNotificationsOpen(false);
                            navigate(notification.to);
                          }}
                        >
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.unread ? 'bg-blue-600' : 'bg-transparent'}`} />
                          <span>
                            <span className="block text-sm font-medium text-slate-800">{notification.title}</span>
                            <span className="mt-1 block text-xs leading-5 text-slate-500">{notification.detail}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {user?.name?.split(' ').map((namePart) => namePart[0]).join('').slice(0, 2)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
              </div>

              <button onClick={handleLogout} className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
