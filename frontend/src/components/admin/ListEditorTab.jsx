import { useState } from 'react';
import { Save, Loader2, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function ListEditorTab({ title, subtitle, data, fields, onSave, sectionKey }) {
  const [items, setItems] = useState(data || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({});

  const handleSave = async () => {
    setSaving(true);
    await onSave(sectionKey, items);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const openEdit = (idx) => {
    setEditIdx(idx);
    setForm(idx === -1
      ? fields.reduce((o, f) => ({ ...o, [f.key]: f.type === 'array' ? [] : f.type === 'boolean' ? false : f.type === 'number' ? null : '' }), {})
      : { ...items[idx] }
    );
  };

  const saveItem = () => {
    const next = [...items];
    if (editIdx === -1) next.push(form); else next[editIdx] = form;
    setItems(next); setEditIdx(null); setForm({});
  };

  const deleteItem = (idx) => {
    if (!confirm('Delete this item?')) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setArr = (key, val) => setForm(f => ({ ...f, [key]: val.split('\n').filter(Boolean) }));

  const visibleFields = fields.filter(f => !f.hideInTable);

  const renderCell = (f, item) => {
    if (f.type === 'color')   return <span className="admin-color-dot" style={{ background: item[f.key] }}/>;
    if (f.type === 'array')   return (item[f.key]||[]).slice(0,2).join(', ') + ((item[f.key]||[]).length > 2 ? '…' : '');
    if (f.type === 'boolean') return item[f.key] ? <span className="admin-badge-ok">Yes</span> : '—';
    return String(item[f.key] ?? '').slice(0, 55);
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        <div className="admin-page-header__actions">
          <button className="admin-add-btn" onClick={() => openEdit(-1)}><Plus size={15}/> Add New</button>
          <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={15} className="spin"/> : <Save size={15}/>}
            {saved ? 'Saved!' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="admin-form-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                {visibleFields.map(f => <th key={f.key}>{f.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={visibleFields.length + 2} style={{ textAlign:'center', padding:40, color:'rgba(160,185,220,0.3)', fontSize:'0.84rem' }}>
                  No items yet. Click <strong>"Add New"</strong> to get started.
                </td></tr>
              )}
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ color:'rgba(160,185,220,0.4)', width:36 }}>{i + 1}</td>
                  {visibleFields.map(f => <td key={f.key}>{renderCell(f, item)}</td>)}
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" onClick={() => openEdit(i)} title="Edit"><Edit2 size={14}/></button>
                      <button className="admin-action-btn admin-action-btn--danger" onClick={() => deleteItem(i)} title="Delete"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {editIdx !== null && (
        <div className="admin-modal-overlay" onClick={() => setEditIdx(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editIdx === -1 ? 'Add' : 'Edit'} {title.replace(/s$/, '')}</h3>
              <button onClick={() => setEditIdx(null)}><X size={18}/></button>
            </div>
            <div className="admin-modal-body">
              {fields.map(f => (
                <div key={f.key} className="admin-field">
                  <label>{f.label}</label>
                  {f.type === 'textarea' && <textarea rows={3} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}/>}
                  {f.type === 'array'    && <textarea rows={4} value={(form[f.key]||[]).join('\n')} onChange={e => setArr(f.key, e.target.value)} placeholder="One per line"/>}
                  {f.type === 'color'    && <input type="color" value={form[f.key] || '#000000'} onChange={e => set(f.key, e.target.value)} style={{ height:42, width:100, padding:2 }}/>}
                  {f.type === 'boolean'  && <label className="admin-checkbox"><input type="checkbox" checked={!!form[f.key]} onChange={e => set(f.key, e.target.checked)}/><span>{f.checkLabel || 'Enabled'}</span></label>}
                  {f.type === 'number'   && <input type="number" value={form[f.key] ?? ''} onChange={e => set(f.key, e.target.value === '' ? null : Number(e.target.value))}/>}
                  {f.type === 'select'   && <select value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}>{(f.options||[]).map(o => <option key={o} value={o}>{o}</option>)}</select>}
                  {(!f.type || f.type === 'text') && <input type="text" value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder || ''}/>}
                </div>
              ))}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-outline" onClick={() => setEditIdx(null)}>Cancel</button>
              <button className="admin-save-btn" onClick={saveItem}><Save size={15}/> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
