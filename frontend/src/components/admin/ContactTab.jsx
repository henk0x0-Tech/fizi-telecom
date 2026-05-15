import { useState } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

export default function ContactTab({ data, onSave }) {
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const s = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await onSave('contact', form);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateHour = (idx, field, val) => {
    const hours = [...(form.hours||[])];
    hours[idx] = { ...hours[idx], [field]: val };
    setForm(f => ({ ...f, hours }));
  };
  const addHour = () => setForm(f => ({ ...f, hours:[...(f.hours||[]),{day:'',time:''}] }));
  const removeHour = idx => setForm(f => ({ ...f, hours:(f.hours||[]).filter((_,i)=>i!==idx) }));

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div><h2>Contact Information</h2><p>Update your company contact details</p></div>
        <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={15} className="spin"/> : <Save size={15}/>}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-form-card">
        <h3>Contact Details</h3>
        <div className="admin-form-row">
          <div className="admin-field"><label>Phone</label><input value={form.phone||''} onChange={e=>s('phone',e.target.value)} placeholder="+243 000 000 000"/></div>
          <div className="admin-field"><label>Email</label><input type="email" value={form.email||''} onChange={e=>s('email',e.target.value)} placeholder="info@fizitelecom.com"/></div>
        </div>
        <div className="admin-form-row">
          <div className="admin-field"><label>Address</label><input value={form.address||''} onChange={e=>s('address',e.target.value)} placeholder="City, Country"/></div>
          <div className="admin-field"><label>WhatsApp Number</label><input value={form.whatsapp||''} onChange={e=>s('whatsapp',e.target.value)} placeholder="243976359001"/></div>
        </div>
        <div className="admin-field"><label>Map Embed URL (optional)</label><input value={form.mapUrl||''} onChange={e=>s('mapUrl',e.target.value)} placeholder="https://maps.google.com/..."/></div>
      </div>

      <div className="admin-form-card">
        <div className="admin-form-card__header">
          <h3>Business Hours</h3>
          <button className="admin-add-sm-btn" onClick={addHour}><Plus size={13}/> Add Row</button>
        </div>
        {(form.hours||[]).length === 0 && (
          <p style={{ fontSize:'0.82rem', color:'rgba(160,185,220,0.35)', textAlign:'center', padding:'16px 0' }}>No hours defined yet.</p>
        )}
        {(form.hours||[]).map((h,i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-form-row">
              <div className="admin-field"><label>Day(s)</label><input value={h.day||''} onChange={e=>updateHour(i,'day',e.target.value)} placeholder="Mon – Fri"/></div>
              <div className="admin-field"><label>Hours</label><input value={h.time||''} onChange={e=>updateHour(i,'time',e.target.value)} placeholder="8:00 AM – 6:00 PM"/></div>
              <button className="admin-remove-btn" onClick={()=>removeHour(i)}><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
