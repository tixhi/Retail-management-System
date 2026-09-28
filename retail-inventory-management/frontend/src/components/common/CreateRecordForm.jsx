import { useState } from 'react';
import api from '../../services/api';

export default function CreateRecordForm({ endpoint, title, fields, buildPayload, onCreated, onCancel }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map((field) => {
      const value = formData.get(field.name);
      return [field.name, field.type === 'number' && value !== '' ? Number(value) : value];
    }));

    try {
      const response = await api.post(endpoint, buildPayload ? buildPayload(values) : values);
      onCreated(response.data.data);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || `Could not create ${title.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-5">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={`create-${field.name}`} className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>
            <input
              id={`create-${field.name}`}
              name={field.name}
              type={field.type || 'text'}
              min={field.type === 'number' ? field.min ?? 0 : undefined}
              step={field.type === 'number' ? field.step ?? 'any' : undefined}
              className="input"
              required={field.required !== false}
            />
          </div>
        ))}
      </div>
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      <div className="flex justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save record'}</button>
      </div>
    </form>
  );
}
