import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Plus, Trash2, Edit2, X, RefreshCw, AlertCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';

/**
 * ApiListTab — CRUD tab for resources with their own REST endpoints.
 * Supports: GET /endpoint, POST /endpoint, PUT /endpoint/:id, DELETE /endpoint/:id
 *
 * Props:
 *   title      — display title
 *   subtitle   — display subtitle
 *   endpoint   — API base path, e.g. '/products'
 *   fields     — field definitions array
 *   idKey      — field used as unique ID (default: '_id', fallback: 'id')
 */
export default function ApiListTab({ title, subtitle, endpoint, fields }) {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [editIdx, setEditIdx] = useState(null); // null=closed, -1=new, n=edit
  const [editItem, setEditItem] = useState(null); // the item being edited (has _id)
  const [form, setForm]     = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const getId = (item) => item?._id || item?.id;

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await apiGet(endpoint);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditItem(null);
    setEditIdx(-1);
    setForm(fields.reduce((o, f) => ({
      ...o,
      [f.key]: f.type === 'array' ? [] : f.type === 'boolean' ? false : f.type === 'number' ? null : ''
    }), {}));
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditIdx(getId(item));
    setForm({ ...item });
  };

  const closeModal = () => { setEditIdx(null); setEditItem(null); setForm({}); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        // UPDATE
        const id = getId(editItem);
        const updated = await apiPut(`${endpoint}/${id}`, form);
        setItems(prev => prev.map(it => getId(it) === id ? updated : it));
      } else {
        // CREATE
        const created = await apiPost(endpoint, form, true);
        setItems(prev => [created, ...prev]);
      }
      closeModal();
    } catch (e) {
      alert('Save failed: ' + (e.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name || item.title || 'this item'}"?`)) return;
    const id = getId(item);
    setDeleting(id);
    try {
      await apiDelete(`${endpoint}/${id}`);
      setItems(prev => prev.filter(it => getId(it) !== id));
    } catch (e) {
      alert('Delete failed: ' + (e.message || 'Unknown error'));
    } finally {
      setDeleting(null);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setArr = (key, val) => setForm(f => ({ ...f, [key]: val.split('\n').filter(v => v.trim()) }));

  const visibleFields = fields.filter(f => !f.hideInTable);

  const renderCell = (f, item) => {
    const val = item[f.key];
    if (f.type === 'color')   return <span className="admin-color-dot" style={{ background: val }}/>;
    if (f.type === 'image')   return val ? <img src={val} alt="" style={{ width:36, height:36, objectFit:'cover', borderRadius:6 }}/> : '—';
    if (f.type === 'array')   return Array.isArray(val) ? val.slice(0,2).join(', ') + (val.length > 2 ? '…' : '') : '—';
    if (f.type === 'boolean') return val ? <span className="admin-badge-ok">Yes</span> : '—';
    if (f.type === 'nested')  return val?.[f.nestedKey] ?? '—';
    return String(val ?? '').slice(0, 55) || '—';
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        <div className="admin-page-header__actions">
          <button className="admin-btn-outline" onClick={load} title="Refresh" style={{ padding:'8px 12px' }}>
            <RefreshCw size={15}/>
          </button>
          <button className="admin-add-btn" onClick={openNew}><Plus size={15}/> Add New</button>
        </div>
      </div>

      <div className="admin-form-card">
        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:'48px 0', color:'rgba(160,185,220,0.5)' }}>
            <Loader2 size={28} className="spin" style={{ marginBottom:12 }}/>
            <p style={{ fontSize:'0.82rem' }}>Loading {title.toLowerCase()}…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'18px 20px',
            background:'rgba(255,60,60,0.07)', border:'1px solid rgba(255,60,60,0.15)',
            borderRadius:10, color:'#ff7070', fontSize:'0.84rem', marginBottom:16 }}>
            <AlertCircle size={18}/>
            <div>
              <strong>Failed to load data</strong>
              <p style={{ margin:'2px 0 0', opacity:0.75 }}>{error}</p>
            </div>
            <button onClick={load} className="admin-btn-outline" style={{ marginLeft:'auto', padding:'6px 12px', fontSize:'0.78rem' }}>
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
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
                  <tr>
                    <td colSpan={visibleFields.length + 2}
                      style={{ textAlign:'center', padding:48, color:'rgba(160,185,220,0.3)', fontSize:'0.84rem' }}>
                      No {title.toLowerCase()} yet. Click <strong>"Add New"</strong> to create one.
                    </td>
                  </tr>
                )}
                {items.map((item, i) => {
                  const id = getId(item);
                  return (
                    <tr key={id || i}>
                      <td style={{ color:'rgba(160,185,220,0.4)', width:40 }}>{i + 1}</td>
                      {visibleFields.map(f => <td key={f.key}>{renderCell(f, item)}</td>)}
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn" onClick={() => openEdit(item)} title="Edit">
                            <Edit2 size={14}/>
                          </button>
                          <button
                            className="admin-action-btn admin-action-btn--danger"
                            onClick={() => handleDelete(item)}
                            title="Delete"
                            disabled={deleting === id}
                          >
                            {deleting === id ? <Loader2 size={14} className="spin"/> : <Trash2 size={14}/>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {editIdx !== null && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editItem ? 'Edit' : 'Add New'} {title.replace(/s$/i, '')}</h3>
              <button onClick={closeModal}><X size={18}/></button>
            </div>
            <div className="admin-modal-body">
              {fields.map(f => (
                <div key={f.key} className="admin-field">
                  <label>{f.label}{f.required && <span style={{color:'#ff6b6b',marginLeft:3}}>*</span>}</label>

                  {f.type === 'textarea' &&
                    <textarea rows={3} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}/>}

                  {f.type === 'array' &&
                    <textarea rows={4}
                      value={Array.isArray(form[f.key]) ? form[f.key].join('\n') : ''}
                      onChange={e => setArr(f.key, e.target.value)}
                      placeholder="One item per line"/>}

                  {f.type === 'color' &&
                    <input type="color" value={form[f.key] || '#000000'} onChange={e => set(f.key, e.target.value)} style={{ height:42, width:100, padding:2 }}/>}

                  {f.type === 'boolean' &&
                    <label className="admin-checkbox">
                      <input type="checkbox" checked={!!form[f.key]} onChange={e => set(f.key, e.target.checked)}/>
                      <span>{f.checkLabel || 'Enabled'}</span>
                    </label>}

                  {f.type === 'number' &&
                    <input type="number" value={form[f.key] ?? ''} placeholder={f.placeholder}
                      onChange={e => set(f.key, e.target.value === '' ? null : Number(e.target.value))}/>}

                  {f.type === 'select' &&
                    <select value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}>
                      <option value="">— Select —</option>
                      {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>}

                  {f.type === 'image' &&
                    <div>
                      <input type="text" value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder="https://..."/>
                      {form[f.key] && <img src={form[f.key]} alt="preview" style={{ marginTop:8, maxHeight:80, borderRadius:6, border:'1px solid rgba(255,255,255,0.1)' }}/>}
                    </div>}

                  {f.type === 'nested' &&
                    <input type={f.nestedType || 'text'}
                      value={form[f.key]?.[f.nestedKey] ?? ''}
                      onChange={e => set(f.key, { ...(form[f.key] || {}), [f.nestedKey]: f.nestedType === 'number' ? Number(e.target.value) : e.target.value })}
                      placeholder={f.placeholder}/>}

                  {(!f.type || f.type === 'text') &&
                    <input type="text" value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}/>}
                </div>
              ))}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 size={15} className="spin"/> : <Save size={15}/>}
                {saving ? 'Saving…' : editItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
