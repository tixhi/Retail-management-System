import useApiCollection from '../../hooks/useApiCollection';
import { useState } from 'react';
import CreateRecordForm from '../../components/common/CreateRecordForm';

export default function WarehousesPage() {
  const { items: warehouses, loading, error, setItems } = useApiCollection('/warehouses');
  const [createOpen, setCreateOpen] = useState(false);
  if (loading) return <div className="card p-10 text-sm text-slate-500">Loading warehouses...</div>;
  if (error) return <div role="alert" className="card p-6 text-sm text-red-700">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Network</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Warehouses</h1>
        </div>
        <button type="button" className="btn-primary" onClick={() => setCreateOpen((open) => !open)}>Add Warehouse</button>
      </div>

      {createOpen ? (
        <CreateRecordForm
          endpoint="/warehouses"
          title="Add warehouse"
          fields={[
            { name: 'name', label: 'Warehouse name' },
            { name: 'code', label: 'Warehouse code' },
            { name: 'city', label: 'City' },
            { name: 'address', label: 'Address', required: false },
            { name: 'manager', label: 'Manager', required: false },
            { name: 'contactNumber', label: 'Contact number', required: false },
          ]}
          onCancel={() => setCreateOpen(false)}
          onCreated={(warehouse) => {
            setItems((items) => [warehouse, ...items]);
            setCreateOpen(false);
          }}
        />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{warehouse.code}</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{warehouse.name}</h2>
              </div>
              <span className={`badge ${warehouse.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {warehouse.status}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600">{warehouse.city}</p>
            <p className="mt-1 text-sm text-slate-600">Manager: {warehouse.manager || 'Unassigned'}</p>
          </div>
        ))}
        {warehouses.length === 0 ? <p className="text-sm text-slate-500">No warehouses have been added.</p> : null}
      </div>
    </div>
  );
}
