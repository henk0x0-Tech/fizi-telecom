import { useState } from 'react';
import { Save, Loader2, Plus, Trash2, GripVertical } from 'lucide-react';

export default function HeroTab({ data, onSave }) {
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave('hero', form);
    setSaving(false);
  };

  const updateMetric = (idx, field, val) => {
    const metrics = [...(form.metrics || [])];
    metrics[idx] = { ...metrics[idx], [field]: val };
    setForm({ ...form, metrics });
  };

  const addMetric = () => {
    setForm({ ...form, metrics: [...(form.metrics || []), { value: '', label: '', color: '#00BFFF', icon: 'Activity', showLive: false }] });
  };

  const removeMetric = (idx) => {
    setForm({ ...form, metrics: (form.metrics || []).filter((_, i) => i !== idx) });
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div><h2>Hero Section</h2><p>Edit the main banner of your homepage</p></div>
        <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={16} className="spin"/> : <Save size={16}/>} Save Changes
        </button>
      </div>

      <div className="admin-form-card">
        <h3>Content</h3>
        <div className="admin-field"><label>Badge Text</label><input value={form.badge || ''} onChange={e => setForm({...form, badge: e.target.value})}/></div>
        <div className="admin-field"><label>Title (use \n for line breaks)</label><textarea rows={3} value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})}/></div>
        <div className="admin-field"><label>Accent Text (highlighted part)</label><input value={form.titleAccent || ''} onChange={e => setForm({...form, titleAccent: e.target.value})}/></div>
        <div className="admin-field"><label>Subtitle</label><textarea rows={2} value={form.subtitle || ''} onChange={e => setForm({...form, subtitle: e.target.value})}/></div>
      </div>

      <div className="admin-form-card">
        <h3>Call-to-Action Buttons</h3>
        <div className="admin-form-row">
          <div className="admin-field"><label>Primary Button Text</label><input value={form.ctaPrimary?.text || ''} onChange={e => setForm({...form, ctaPrimary: {...form.ctaPrimary, text: e.target.value}})}/></div>
          <div className="admin-field"><label>Primary Button Link</label><input value={form.ctaPrimary?.link || ''} onChange={e => setForm({...form, ctaPrimary: {...form.ctaPrimary, link: e.target.value}})}/></div>
        </div>
        <div className="admin-form-row">
          <div className="admin-field"><label>Secondary Button Text</label><input value={form.ctaSecondary?.text || ''} onChange={e => setForm({...form, ctaSecondary: {...form.ctaSecondary, text: e.target.value}})}/></div>
          <div className="admin-field"><label>Secondary Button Link</label><input value={form.ctaSecondary?.link || ''} onChange={e => setForm({...form, ctaSecondary: {...form.ctaSecondary, link: e.target.value}})}/></div>
        </div>
      </div>

      <div className="admin-form-card">
        <div className="admin-form-card__header"><h3>Metric Cards</h3><button className="admin-add-sm-btn" onClick={addMetric}><Plus size={14}/> Add</button></div>
        {(form.metrics || []).map((m, i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-form-row">
              <div className="admin-field"><label>Value</label><input value={m.value || ''} onChange={e => updateMetric(i, 'value', e.target.value)}/></div>
              <div className="admin-field"><label>Label</label><input value={m.label || ''} onChange={e => updateMetric(i, 'label', e.target.value)}/></div>
              <div className="admin-field"><label>Color</label><input type="color" value={m.color || '#00BFFF'} onChange={e => updateMetric(i, 'color', e.target.value)} style={{height:38}}/></div>
              <button className="admin-remove-btn" onClick={() => removeMetric(i)}><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
