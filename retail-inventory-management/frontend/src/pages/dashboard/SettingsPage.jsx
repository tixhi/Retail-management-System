import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [admin, setAdmin] = useState({ name: '', email: '', password: '' });
  const [adminError, setAdminError] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [savingAdmin, setSavingAdmin] = useState(false);

  const createAdmin = async (event) => {
    event.preventDefault();
    setAdminError('');
    setAdminMessage('');
    setSavingAdmin(true);

    try {
      const response = await api.post('/auth/register-admin', admin);
      setAdminMessage(response.data.message || 'Admin account created.');
      setAdmin({ name: '', email: '', password: '' });
    } catch (error) {
      setAdminError(error?.response?.data?.message || 'Could not create the admin account. Check that MongoDB is connected.');
    } finally {
      setSavingAdmin(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">System settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">General</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Company name</label>
              <input className="input" defaultValue="Retail Inventory Hub" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Business timezone</label>
              <input className="input" defaultValue="Asia/Kolkata" />
            </div>
          </div>
        </div>

        {user?.role === 'Admin' ? (
          <section className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><UserPlus size={18} /> Add administrator</h2>
            <p className="mt-2 text-sm text-slate-600">Create an Admin account that is saved in MongoDB and can sign in later.</p>
            <form onSubmit={createAdmin} className="mt-5 space-y-4">
              <div>
                <label htmlFor="admin-name" className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                <input id="admin-name" className="input" value={admin.name} onChange={(event) => setAdmin({ ...admin, name: event.target.value })} required maxLength={100} />
              </div>
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                <input id="admin-email" className="input" type="email" value={admin.email} onChange={(event) => setAdmin({ ...admin, email: event.target.value })} required />
              </div>
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-700">Temporary password</label>
                <input id="admin-password" className="input" type="password" value={admin.password} onChange={(event) => setAdmin({ ...admin, password: event.target.value })} required minLength={12} autoComplete="new-password" />
                <p className="mt-1 text-xs text-slate-500">Use at least 12 characters. Share it with the new administrator securely.</p>
              </div>
              {adminError ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{adminError}</p> : null}
              {adminMessage ? <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{adminMessage}</p> : null}
              <button type="submit" className="btn-primary" disabled={savingAdmin}><UserPlus size={16} className="mr-2" />{savingAdmin ? 'Creating...' : 'Create admin account'}</button>
            </form>
          </section>
        ) : null}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <span>Low-stock alerts</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <span>Order status updates</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <span>Purchase order reminders</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
