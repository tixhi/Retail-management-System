export default function SettingsPage() {
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
