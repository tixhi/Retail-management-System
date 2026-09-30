const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const state = {
  products: [
    { _id: 'p-101', name: 'Wireless Mouse', sku: 'WM-101', category: 'Electronics', price: 899, costPrice: 640, supplier: 'Northwind Supply', status: 'In Stock', reorderLevel: 12 },
    { _id: 'p-102', name: 'Mechanical Keyboard', sku: 'MK-204', category: 'Electronics', price: 2199, costPrice: 1490, supplier: 'Prime Goods', status: 'In Stock', reorderLevel: 10 },
    { _id: 'p-103', name: 'USB-C Hub', sku: 'USB-332', category: 'Accessories', price: 1499, costPrice: 980, supplier: 'Metro Logistics', status: 'Low Stock', reorderLevel: 8 },
    { _id: 'p-104', name: 'Office Chair', sku: 'OC-009', category: 'Furniture', price: 6999, costPrice: 4700, supplier: 'Northwind Supply', status: 'In Stock', reorderLevel: 6 },
    { _id: 'p-105', name: 'Portable Speaker', sku: 'PS-118', category: 'Electronics', price: 3499, costPrice: 2300, supplier: 'Prime Goods', status: 'In Stock', reorderLevel: 9 },
    { _id: 'p-106', name: 'Smartwatch', sku: 'SW-511', category: 'Wearables', price: 5999, costPrice: 4100, supplier: 'Metro Logistics', status: 'Low Stock', reorderLevel: 7 },
  ],
  warehouses: [
    { _id: 'wh-001', name: 'North Hub', code: 'NH-01', city: 'Delhi', address: 'Plot 14, Industrial Area', manager: 'Aisha Khan', contactNumber: '+91 98100 00001', status: 'Active' },
    { _id: 'wh-002', name: 'Central Depot', code: 'CD-02', city: 'Bengaluru', address: '20th Cross, Electronic City', manager: 'Rohit Nair', contactNumber: '+91 98100 00002', status: 'Active' },
    { _id: 'wh-003', name: 'Coastal Store', code: 'CS-03', city: 'Mumbai', address: 'Harbor Road, Taloja', manager: 'Neha Shah', contactNumber: '+91 98100 00003', status: 'Active' },
  ],
  suppliers: [
    { _id: 'sup-01', companyName: 'Northwind Supply', contact: 'Ava Sharma', contactPerson: 'Ava Sharma', email: 'ava@northwind.com', phone: '+91 90000 11111', status: 'Active' },
    { _id: 'sup-02', companyName: 'Prime Goods', contact: 'Rohan Iyer', contactPerson: 'Rohan Iyer', email: 'rohan@primegoods.com', phone: '+91 90000 22222', status: 'Active' },
    { _id: 'sup-03', companyName: 'Metro Logistics', contact: 'Neha Singh', contactPerson: 'Neha Singh', email: 'neha@metrologistics.com', phone: '+91 90000 33333', status: 'Preferred' },
  ],
  inventory: [
    { _id: 'inv-101', productId: 'p-101', productName: 'Wireless Mouse', warehouseId: 'wh-001', warehouseName: 'North Hub', currentStock: 40, availableStock: 34, reservedStock: 6, reorderLevel: 12, stockStatus: 'Healthy' },
    { _id: 'inv-102', productId: 'p-102', productName: 'Mechanical Keyboard', warehouseId: 'wh-002', warehouseName: 'Central Depot', currentStock: 28, availableStock: 22, reservedStock: 6, reorderLevel: 10, stockStatus: 'Healthy' },
    { _id: 'inv-103', productId: 'p-103', productName: 'USB-C Hub', warehouseId: 'wh-003', warehouseName: 'Coastal Store', currentStock: 11, availableStock: 7, reservedStock: 4, reorderLevel: 8, stockStatus: 'Low Stock' },
    { _id: 'inv-104', productId: 'p-104', productName: 'Office Chair', warehouseId: 'wh-001', warehouseName: 'North Hub', currentStock: 18, availableStock: 16, reservedStock: 2, reorderLevel: 6, stockStatus: 'Healthy' },
    { _id: 'inv-105', productId: 'p-105', productName: 'Portable Speaker', warehouseId: 'wh-002', warehouseName: 'Central Depot', currentStock: 26, availableStock: 20, reservedStock: 6, reorderLevel: 9, stockStatus: 'Healthy' },
    { _id: 'inv-106', productId: 'p-106', productName: 'Smartwatch', warehouseId: 'wh-003', warehouseName: 'Coastal Store', currentStock: 9, availableStock: 5, reservedStock: 4, reorderLevel: 7, stockStatus: 'Low Stock' },
  ],
  orders: [
    { _id: 'ord-001', orderId: 'ORD-1001', customer: 'Aditi Verma', warehouse: 'North Hub', totalAmount: 3598, status: 'Packed' },
    { _id: 'ord-002', orderId: 'ORD-1002', customer: 'Rahul Nair', warehouse: 'Central Depot', totalAmount: 2199, status: 'Shipped' },
    { _id: 'ord-003', orderId: 'ORD-1003', customer: 'Meera Joshi', warehouse: 'Coastal Store', totalAmount: 1499, status: 'Delivered' },
    { _id: 'ord-004', orderId: 'ORD-1004', customer: 'Kunal Rao', warehouse: 'North Hub', totalAmount: 6999, status: 'Processing' },
  ],
  purchaseOrders: [
    { _id: 'po-001', poNumber: 'PO-1001', supplier: 'Northwind Supply', totalCost: 18500, status: 'Approved' },
    { _id: 'po-002', poNumber: 'PO-1002', supplier: 'Prime Goods', totalCost: 24200, status: 'In Transit' },
    { _id: 'po-003', poNumber: 'PO-1003', supplier: 'Metro Logistics', totalCost: 15600, status: 'Draft' },
  ],
};

function withCreatedId(entry, prefix) {
  return { ...entry, _id: `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}` };
}

export function resolveFallbackResponse(method, url, payload) {
  const normalizedPath = String(url || '').replace(/^\/api/, '');
  const requestMethod = String(method || 'get').toLowerCase();
  const parsed = typeof payload === 'string' ? JSON.parse(payload || '{}') : (payload || {});

  if (requestMethod === 'post' && normalizedPath === '/products') {
    const newProduct = {
      ...parsed,
      _id: `p-${Date.now()}`,
      status: parsed.status || 'In Stock',
      price: Number(parsed.price || 0),
      costPrice: Number(parsed.costPrice || 0),
      reorderLevel: Number(parsed.reorderLevel || 8),
    };
    state.products.unshift(newProduct);
    return { data: { data: newProduct } };
  }

  if (requestMethod === 'post' && normalizedPath === '/suppliers') {
    const newSupplier = {
      ...parsed,
      _id: `sup-${Date.now()}`,
      companyName: parsed.companyName || parsed.name || 'New Supplier',
      contact: parsed.contactPerson || parsed.contact || parsed.companyName || 'New Contact',
      status: 'Active',
    };
    state.suppliers.unshift(newSupplier);
    return { data: { data: newSupplier } };
  }

  if (requestMethod === 'post' && normalizedPath === '/warehouses') {
    const newWarehouse = {
      ...parsed,
      _id: `wh-${Date.now()}`,
      code: parsed.code || `WH-${state.warehouses.length + 1}`,
      status: parsed.status || 'Active',
    };
    state.warehouses.unshift(newWarehouse);
    return { data: { data: newWarehouse } };
  }

  if (requestMethod === 'post' && normalizedPath === '/orders') {
    const newOrder = {
      ...parsed,
      _id: `ord-${Date.now()}`,
      orderId: `ORD-${Math.floor(2000 + Math.random() * 9000)}`,
      warehouse: parsed.warehouse || 'North Hub',
      totalAmount: Number(parsed.totalAmount || 0),
      status: 'Queued',
    };
    state.orders.unshift(newOrder);
    return { data: { data: newOrder } };
  }

  if (requestMethod === 'post' && normalizedPath === '/purchase-orders') {
    const item = parsed.items?.[0] || {};
    const totalCost = Number(item.unitCost || 0) * Number(item.quantity || 0);
    const newPo = {
      ...parsed,
      _id: `po-${Date.now()}`,
      poNumber: `PO-${Math.floor(2000 + Math.random() * 9000)}`,
      supplier: parsed.supplier || 'New Supplier',
      totalCost,
      status: 'Draft',
    };
    state.purchaseOrders.unshift(newPo);
    return { data: { data: newPo } };
  }

  if (requestMethod === 'post' && normalizedPath === '/inventory/adjust') {
    const target = state.inventory.find((entry) => entry.productId === parsed.productId && entry.warehouseId === parsed.warehouseId);
    if (!target) {
      throw new Error('Selected inventory item not found.');
    }
    const quantity = Number(parsed.quantity || 0);
    target.currentStock += quantity;
    target.availableStock += quantity;
    target.stockStatus = target.availableStock <= target.reorderLevel ? 'Low Stock' : 'Healthy';
    return { data: { data: target } };
  }

  if (requestMethod === 'post' && normalizedPath === '/inventory/transfer') {
    const source = state.inventory.find((entry) => entry.productId === parsed.productId && entry.warehouseId === parsed.sourceWarehouseId);
    const destination = state.inventory.find((entry) => entry.productId === parsed.productId && entry.warehouseId === parsed.destinationWarehouseId) || {
      ...withCreatedId({
        productId: parsed.productId,
        productName: state.products.find((product) => product._id === parsed.productId)?.name || 'Product',
        warehouseId: parsed.destinationWarehouseId,
        warehouseName: state.warehouses.find((warehouse) => warehouse._id === parsed.destinationWarehouseId)?.name || 'Destination Warehouse',
        currentStock: 0,
        availableStock: 0,
        reservedStock: 0,
        reorderLevel: 5,
        stockStatus: 'Healthy',
      }, 'inv'),
    };
    const quantity = Number(parsed.quantity || 0);

    if (!source || source.availableStock < quantity) {
      throw new Error('Not enough stock for transfer.');
    }

    source.availableStock -= quantity;
    source.currentStock -= quantity;
    source.stockStatus = source.availableStock <= source.reorderLevel ? 'Low Stock' : 'Healthy';

    destination.currentStock = Number(destination.currentStock || 0) + quantity;
    destination.availableStock = Number(destination.availableStock || 0) + quantity;
    destination.reservedStock = Number(destination.reservedStock || 0);
    destination.stockStatus = destination.availableStock <= destination.reorderLevel ? 'Low Stock' : 'Healthy';

    if (!state.inventory.some((entry) => entry._id === destination._id)) {
      state.inventory.push(destination);
    }

    return { data: { data: destination } };
  }

  if (normalizedPath === '/products') return { data: { data: state.products } };
  if (normalizedPath === '/warehouses') return { data: { data: state.warehouses } };
  if (normalizedPath === '/suppliers') return { data: { data: state.suppliers } };
  if (normalizedPath === '/inventory') return { data: { data: state.inventory } };
  if (normalizedPath === '/orders') return { data: { data: state.orders } };
  if (normalizedPath === '/purchase-orders') return { data: { data: state.purchaseOrders } };

  if (normalizedPath === '/reports/dashboard') {
    const lowStock = state.inventory.filter((item) => item.availableStock <= item.reorderLevel);
    const trend = [
      { month: 'Jan', sales: 38000 },
      { month: 'Feb', sales: 44000 },
      { month: 'Mar', sales: 49000 },
      { month: 'Apr', sales: 56000 },
      { month: 'May', sales: 61000 },
      { month: 'Jun', sales: 67000 },
    ];

    return {
      data: {
        kpis: [
          { title: 'Revenue', value: currencyFormatter.format(128000), change: '+10.4%', icon: 'trending-up', tone: 'blue' },
          { title: 'Orders', value: '342', change: '+8.2%', icon: 'shopping-cart', tone: 'green' },
          { title: 'Avg. Margin', value: '29.1%', change: '+1.8%', icon: 'percent', tone: 'amber' },
          { title: 'Stock health', value: '89%', change: '+3.4%', icon: 'boxes', tone: 'purple' },
        ],
        trend,
        inventoryMovement: [
          { name: 'Inbound', value: 140 },
          { name: 'Outbound', value: 95 },
          { name: 'Adjustments', value: 38 },
          { name: 'Returns', value: 20 },
        ],
        warehouseDistribution: [
          { name: 'North Hub', value: 36 },
          { name: 'Central Depot', value: 42 },
          { name: 'Coastal Store', value: 22 },
        ],
        topProducts: state.products.slice(0, 4).map((product, index) => ({ name: product.name, units: 48 + index * 11 })),
        recentOrders: state.orders.slice(0, 3).map((order) => ({ ...order, total: currencyFormatter.format(order.totalAmount) })),
        transactions: [
          { type: 'Receipt', qty: '+18', product: 'Mechanical Keyboard', warehouse: 'North Hub' },
          { type: 'Transfer', qty: '-6', product: 'Portable Speaker', warehouse: 'Central Depot' },
          { type: 'Adjustment', qty: '+9', product: 'Smartwatch', warehouse: 'Coastal Store' },
        ],
        lowStock: lowStock.slice(0, 3).map((item) => ({ item: item.productName, warehouse: item.warehouseName, quantity: item.availableStock })),
      },
    };
  }

  return null;
}
