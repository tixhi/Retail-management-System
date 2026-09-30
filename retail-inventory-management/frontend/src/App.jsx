import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import InventoryPage from './pages/inventory/InventoryPage';
import OrdersPage from './pages/orders/OrdersPage';
import WarehousesPage from './pages/warehouses/WarehousesPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import PurchaseOrdersPage from './pages/purchase-orders/PurchaseOrdersPage';
import ReportsPage from './pages/reports/ReportsPage';
import FulfillmentPage from './pages/orders/FulfillmentPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import CatalogPage from './pages/customer/CatalogPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import OrderDetailsPage from './pages/customer/OrderDetailsPage';
import Layout from './components/common/Layout';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'Customer' ? '/catalog' : '/dashboard'} replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to={user?.role === 'Customer' ? '/catalog' : '/dashboard'} replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="my-orders" element={<MyOrdersPage />} />
        <Route path="my-orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="fulfillment" element={<FulfillmentPage />} />
        <Route path="warehouses" element={<WarehousesPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? (user?.role === 'Customer' ? '/catalog' : '/dashboard') : '/login'} replace />} />
    </Routes>
  );
}
