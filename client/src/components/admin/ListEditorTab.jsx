import { useState } from 'react';
import { Save, Loader2, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function ListEditorTab({ title, subtitle, data, fields, onSave, sectionKey }) {
  const [items, setItems] = useState(data || []);
  const [saving, setSaving] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({});

  const handleSave = async () => {
    setSaving(true);
    await onSave(sectionKey, items);
    setSaving(false);
  };

  const openEdit = (idx) => {
    setEditIdx(idx);
    setForm(idx === -1 ? fields.reduce((o, f) => ({ ...o, [f.key]: f.default || '' }), {}) : { ...items[idx] });
  };

  const saveItem = () => {
    const updated = [...items];
    if (editIdx === -1) updated.push(form);
    else updated[editIdx] = form;
    setItems(updated);
    setEditIdx(null);
    setForm({});
  };

  const deleteItem = (idx) => {
    if (!confirm('Delete this item?')) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateField = (key, val) => setForm({ ...form, [key]: val });

  const updateArrayField = (key, val) => {
    setForm({ ...form, [key]: val.split('\n') });
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        <div style={{display:'flex',gap:8}}>
          <button className="admin-add-btn" onClick={() => openEdit(-1)}><Plus size={16}/> Add New</button>
          <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={16} className="spin"/> : <Save size={16}/>} Save All
          </button>
        </div>
      </div>

      <div className="admin-form-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>{fields.filter(f => !f.hideInTable).map(f => <th key={f.key}>{f.label}</th>)}<th>Actions</th></tr></thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  {fields.filter(f => !f.hideInTable).map(f => (
                    <td key={f.key}>
                      {f.type === 'color' ? <span className="admin-color-dot" style={{background: item[f.key]}}/> :
                       f.type === 'array' ? (item[f.key] || []).slice(0,2).join(', ') + ((item[f.key]||[]).length > 2 ? '...' : '') :
                       f.type === 'boolean' ? (item[f.key] ? '✓' : '—') :
                       f.type === 'number' ? (item[f.key] != null ? item[f.key] : '—') :
                       String(item[f.key] || '').slice(0, 60)}
                    </td>
                  ))}
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" onClick={() => openEdit(i)}><Edit2 size={15}/></button>
                      <button className="admin-action-btn admin-action-btn--danger" onClick={() => deleteItem(i)}><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={fields.length + 1} style={{textAlign:'center',padding:32,opacity:.5}}>No items yet. Click "Add New" to get started.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editIdx !== null && (
        <div className="admin-modal-overlay" onClick={() => setEditIdx(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header"><h3>{editIdx === -1 ? 'Add New' : 'Edit'} {title.replace(/s$/, '')}</h3><button onClick={() => setEditIdx(null)}><X size={20}/></button></div>
            <div className="admin-modal-body">
              {fields.map(f => (
                <div key={f.key} className="admin-field">
                  <label>{f.label}</label>
                  {f.type === 'textarea' ? <textarea rows={3} value={form[f.key] || ''} onChange={e => updateField(f.key, e.target.value)}/> :
                   f.type === 'array' ? <textarea rows={4} value={(form[f.key] || []).join('\n')} onChange={e => updateArrayField(f.key, e.target.value)} placeholder="One per line"/> :
                   f.type === 'color' ? <input type="color" value={form[f.key] || '#000000'} onChange={e => updateField(f.key, e.target.value)} style={{height:40,width:80}}/> :
                   f.type === 'boolean' ? <label className="admin-checkbox"><input type="checkbox" checked={!!form[f.key]} onChange={e => updateField(f.key, e.target.checked)}/><span>{f.checkLabel || 'Enabled'}</span></label> :
                   f.type === 'number' ? <input type="number" value={form[f.key] ?? ''} onChange={e => updateField(f.key, e.target.value === '' ? null : Number(e.target.value))}/> :
                   f.type === 'select' ? <select value={form[f.key] || ''} onChange={e => updateField(f.key, e.target.value)}>{(f.options||[]).map(o => <option key={o} value={o}>{o}</option>)}</select> :
                   <input type="text" value={form[f.key] || ''} onChange={e => updateField(f.key, e.target.value)}/>}
                </div>
              ))}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-outline" onClick={() => setEditIdx(null)}>Cancel</button>
              <button className="admin-save-btn" onClick={saveItem}><Save size={16}/> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
