import { useState } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

export default function HeroTab({ data, onSave }) {
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const s = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await onSave('hero', form);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateMetric = (idx, field, val) => {
    const metrics = [...(form.metrics || [])];
    metrics[idx] = { ...metrics[idx], [field]: val };
    setForm(f => ({ ...f, metrics }));
  };
  const addMetric = () => setForm(f => ({ ...f, metrics: [...(f.metrics||[]), { value:'', label:'', color:'#00BFFF' }] }));
  const removeMetric = idx => setForm(f => ({ ...f, metrics: (f.metrics||[]).filter((_,i) => i!==idx) }));

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div><h2>Hero Section</h2><p>Edit the main hero banner of your homepage</p></div>
        <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={15} className="spin"/> : <Save size={15}/>}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-form-card">
        <h3>Content</h3>
        <div className="admin-field"><label>Badge Text</label><input value={form.badge||''} onChange={e=>s('badge',e.target.value)} placeholder="e.g. Fiber Internet"/></div>
        <div className="admin-field"><label>Title</label><textarea rows={2} value={form.title||''} onChange={e=>s('title',e.target.value)} placeholder="Main headline"/></div>
        <div className="admin-field"><label>Accent Text (highlighted)</label><input value={form.titleAccent||''} onChange={e=>s('titleAccent',e.target.value)}/></div>
        <div className="admin-field"><label>Subtitle</label><textarea rows={2} value={form.subtitle||''} onChange={e=>s('subtitle',e.target.value)}/></div>
      </div>

      <div className="admin-form-card">
        <h3>Call-to-Action Buttons</h3>
        <div className="admin-form-row">
          <div className="admin-field"><label>Primary Button Text</label><input value={form.ctaPrimary?.text||''} onChange={e=>s('ctaPrimary',{...form.ctaPrimary,text:e.target.value})}/></div>
          <div className="admin-field"><label>Primary Button Link</label><input value={form.ctaPrimary?.link||''} onChange={e=>s('ctaPrimary',{...form.ctaPrimary,link:e.target.value})} placeholder="/services"/></div>
        </div>
        <div className="admin-form-row">
          <div className="admin-field"><label>Secondary Button Text</label><input value={form.ctaSecondary?.text||''} onChange={e=>s('ctaSecondary',{...form.ctaSecondary,text:e.target.value})}/></div>
          <div className="admin-field"><label>Secondary Button Link</label><input value={form.ctaSecondary?.link||''} onChange={e=>s('ctaSecondary',{...form.ctaSecondary,link:e.target.value})} placeholder="/contact"/></div>
        </div>
      </div>

      <div className="admin-form-card">
        <div className="admin-form-card__header">
          <h3>Metric Cards</h3>
          <button className="admin-add-sm-btn" onClick={addMetric}><Plus size={13}/> Add Card</button>
        </div>
        {(form.metrics||[]).length === 0 && (
          <p style={{ fontSize:'0.82rem', color:'rgba(160,185,220,0.35)', textAlign:'center', padding:'16px 0' }}>No metric cards yet.</p>
        )}
        {(form.metrics||[]).map((m,i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-form-row">
              <div className="admin-field"><label>Value</label><input value={m.value||''} onChange={e=>updateMetric(i,'value',e.target.value)} placeholder="99.99%"/></div>
              <div className="admin-field"><label>Label</label><input value={m.label||''} onChange={e=>updateMetric(i,'label',e.target.value)} placeholder="Uptime SLA"/></div>
              <div className="admin-field"><label>Color</label><input type="color" value={m.color||'#00BFFF'} onChange={e=>updateMetric(i,'color',e.target.value)} style={{height:42}}/></div>
              <button className="admin-remove-btn" onClick={()=>removeMetric(i)}><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
