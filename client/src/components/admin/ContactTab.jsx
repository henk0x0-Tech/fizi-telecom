import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

export default function ContactTab({ data, onSave }) {
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave('contact', form);
    setSaving(false);
  };

  const updateHour = (idx, field, val) => {
    const hours = [...(form.hours || [])];
    hours[idx] = { ...hours[idx], [field]: val };
    setForm({ ...form, hours });
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div><h2>Contact Information</h2><p>Update your company contact details</p></div>
        <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={16} className="spin"/> : <Save size={16}/>} Save Changes
        </button>
      </div>

      <div className="admin-form-card">
        <h3>Contact Details</h3>
        <div className="admin-form-row">
          <div className="admin-field"><label>Phone</label><input value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})}/></div>
          <div className="admin-field"><label>Email</label><input value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})}/></div>
        </div>
        <div className="admin-form-row">
          <div className="admin-field"><label>Address</label><input value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})}/></div>
          <div className="admin-field"><label>WhatsApp Number</label><input value={form.whatsapp || ''} onChange={e => setForm({...form, whatsapp: e.target.value})}/></div>
        </div>
      </div>

      <div className="admin-form-card">
        <h3>Business Hours</h3>
        {(form.hours || []).map((h, i) => (
          <div key={i} className="admin-form-row">
            <div className="admin-field"><label>Day</label><input value={h.day || ''} onChange={e => updateHour(i, 'day', e.target.value)}/></div>
            <div className="admin-field"><label>Time</label><input value={h.time || ''} onChange={e => updateHour(i, 'time', e.target.value)}/></div>
          </div>
        ))}
      </div>
    </div>
  );
}
