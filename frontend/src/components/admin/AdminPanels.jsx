import { useState, useCallback, useRef } from 'react';
import { authHeaders } from '../../utils/api';

const API = import.meta.env.VITE_API_URL || '/api';

/* ─── Toast ─────────────────────────────────────────────────────────────── */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, add };
}

export function ToastWrap({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="adm-toast-wrap" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`adm-toast adm-toast--${t.type}`}>
          {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'} {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── Confirm Modal ──────────────────────────────────────────────────────── */
function ConfirmModal({ title, msg, onConfirm, onCancel }) {
  return (
    <div className="adm-overlay" role="dialog" aria-modal="true" onClick={onCancel}>
      <div className="adm-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="adm-modal__head">
          <span className="adm-modal__title">⚠️ {title || 'Confirm'}</span>
          <button className="adm-modal__close" onClick={onCancel} aria-label="Close">✕</button>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--adm-muted)', lineHeight: 1.65, margin: '0 0 24px' }}>{msg}</p>
        <div className="adm-modal__foot">
          <button className="adm-btn adm-btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Image Card ─────────────────────────────────────────────────────────── */
function ImgCard({ img, onDelete, onCopy }) {
  const basePath = API.replace('/api', '');
  const src = img.url || `${basePath}/uploads/${img.filename}`;
  const name = img.filename || img.name || 'image';
  const kb = img.size ? `${(img.size / 1024).toFixed(0)} KB` : '';

  return (
    <div className="adm-img-card">
      <div className="adm-img-card__thumb-wrap">
        <img
          className="adm-img-card__thumb"
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
        />
        <div className="adm-img-card__overlay">
          <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => onCopy(src)}>📋 Copy URL</button>
          <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => onDelete(img)}>🗑 Delete</button>
        </div>
      </div>
      <div className="adm-img-card__info">
        <p className="adm-img-card__name" title={name}>{name}</p>
        <p className="adm-img-card__meta">{kb}{kb ? ' · ' : ''}WebP</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   IMAGE MANAGER
═══════════════════════════════════════════════════════════════════════════ */
export function ImageManager({ toast }) {
  const [images, setImages]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragover, setDragover] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [search, setSearch]     = useState('');
  const [confirm, setConfirm]   = useState(null);
  const [fetched, setFetched]   = useState(false);
  const fileRef = useRef();

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/upload/list`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      } else {
        toast('Could not load images from server.', 'error');
        setImages([]);
      }
    } catch {
      toast('Server unreachable — showing empty library.', 'error');
      setImages([]);
    }
    setFetched(true);
    setLoading(false);
  }, [toast]);

  if (!fetched && !loading) fetchImages();

  const addFiles = files => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!valid.length) { toast('Only image files are allowed.', 'error'); return; }
    const tooBig = valid.filter(f => f.size > 10 * 1024 * 1024);
    if (tooBig.length) { toast('Max file size is 10 MB.', 'error'); return; }
    setPreviews(p => [...p, ...valid.map(f => ({ file: f, url: URL.createObjectURL(f) }))]);
  };

  const removePreview = i => {
    URL.revokeObjectURL(previews[i].url);
    setPreviews(p => p.filter((_, idx) => idx !== i));
  };

  const uploadAll = async () => {
    if (!previews.length) return;
    setUploading(true);
    let ok = 0, fail = 0;
    for (const { file } of previews) {
      try {
        const fd = new FormData();
        fd.append('image', file);
        const res = await fetch(`${API}/upload`, { method: 'POST', headers: authHeaders(), body: fd });
        if (res.ok) ok++;
        else fail++;
      } catch { fail++; }
    }
    previews.forEach(p => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setUploading(false);
    if (ok)   toast(`✓ ${ok} image${ok > 1 ? 's' : ''} uploaded & converted to WebP!`, 'success');
    if (fail) toast(`${fail} file${fail > 1 ? 's' : ''} failed to upload.`, 'error');
    if (ok) fetchImages();
  };

  const doDelete = async img => {
    setConfirm(null);
    const filename = img.filename || img.name;
    try {
      const res = await fetch(`${API}/upload/${encodeURIComponent(filename)}`, {
        method: 'DELETE', headers: authHeaders(),
      });
      if (res.ok) {
        setImages(imgs => imgs.filter(i => (i.filename || i.name) !== filename));
        toast('Image deleted.', 'success');
      } else {
        toast('Delete failed.', 'error');
      }
    } catch { toast('Network error.', 'error'); }
  };

  const copyUrl = async url => {
    try { await navigator.clipboard.writeText(url); toast('URL copied to clipboard!', 'success'); }
    catch { toast('Copy failed — check browser permissions.', 'error'); }
  };

  const filtered = images.filter(i =>
    (i.filename || i.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-panel">
      <div className="adm-panel__header">
        <h2 className="adm-panel__title">Image Library</h2>
        <p className="adm-panel__sub">Upload and manage website images. All uploads are auto-converted to WebP.</p>
      </div>

      {/* Drop zone */}
      <div
        className={`adm-dropzone${dragover ? ' adm-dropzone--over' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Click or drag images here to upload"
        onClick={() => fileRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragover(true); }}
        onDragLeave={() => setDragover(false)}
        onDrop={e => { e.preventDefault(); setDragover(false); addFiles(e.dataTransfer.files); }}
      >
        <div className="adm-dropzone__icon">{dragover ? '⬇️' : '🖼️'}</div>
        <p className="adm-dropzone__title">{dragover ? 'Drop to add' : 'Drag & drop images, or click to browse'}</p>
        <p className="adm-dropzone__sub">PNG · JPG · WebP · Max 10 MB · Auto-converted to WebP</p>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => addFiles(e.target.files)} />
      </div>

      {/* Preview strip */}
      {previews.length > 0 && (
        <div className="adm-preview-section">
          <div className="adm-preview-strip">
            {previews.map((p, i) => (
              <div key={i} className="adm-preview-item">
                <img src={p.url} alt={p.file.name} />
                <div className="adm-preview-item__name">{p.file.name.substring(0, 14)}…</div>
                <button className="adm-preview-item__rm" onClick={() => removePreview(i)} aria-label="Remove">✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="adm-btn adm-btn--primary" onClick={uploadAll} disabled={uploading}>
              {uploading
                ? <><span className="adm-spinner adm-spinner--sm" /> Uploading…</>
                : `⬆️ Upload ${previews.length} file${previews.length > 1 ? 's' : ''}`}
            </button>
            <button className="adm-btn adm-btn--ghost" onClick={() => { previews.forEach(p => URL.revokeObjectURL(p.url)); setPreviews([]); }}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search">
          <span>🔍</span>
          <input
            placeholder="Search images…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search images"
          />
          {search && <button className="adm-search__clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
          <span className="adm-count">{filtered.length} image{filtered.length !== 1 ? 's' : ''}</span>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={fetchImages} disabled={loading}>
            {loading ? <span className="adm-spinner adm-spinner--sm" /> : '🔄'} Refresh
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="adm-center-loader"><div className="adm-spinner adm-spinner--lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty__icon">📂</div>
          <p>{search ? 'No images match your search.' : 'No images uploaded yet. Use the drop zone above.'}</p>
        </div>
      ) : (
        <div className="adm-img-grid">
          {filtered.map((img, i) => (
            <ImgCard key={img.filename || i} img={img} onDelete={setConfirm} onCopy={copyUrl} />
          ))}
        </div>
      )}

      {confirm && (
        <ConfirmModal
          title="Delete Image"
          msg={`Permanently delete "${confirm.filename || confirm.name}"? This cannot be undone.`}
          onConfirm={() => doDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTENT MANAGER
═══════════════════════════════════════════════════════════════════════════ */
const TYPES = [
  {
    key: 'services', label: 'Services', endpoint: '/services',
    cols: ['name', 'category', 'description'],
    fields: [
      { k: 'name',        l: 'Name',             t: 'text',     req: true },
      { k: 'category',    l: 'Category',          t: 'select',
        opts: ['Connectivity','WiFi & Smart Solutions','Enterprise Networking','Support & Maintenance','Security','IT Infrastructure'] },
      { k: 'description', l: 'Description',       t: 'textarea' },
      { k: 'image',       l: 'Image path (e.g. /images/wifi_setup.webp)', t: 'text' },
    ],
    empty: { name: '', category: 'Connectivity', description: '', image: '' },
  },
  {
    key: 'products', label: 'Products', endpoint: '/products',
    cols: ['name', 'brand', 'category', 'price'],
    fields: [
      { k: 'name',         l: 'Name',         t: 'text', req: true },
      { k: 'brand',        l: 'Brand',        t: 'text' },
      { k: 'category',     l: 'Category',     t: 'select', opts: ['Laptops','Desktops','Printers','Desktop Accessories','Networking','Other'] },
      { k: 'price',        l: 'Price (USD)',  t: 'number' },
      { k: 'availability', l: 'Availability', t: 'select', opts: ['In Stock','Low Stock','Out of Stock','Pre-Order'] },
      { k: 'description',  l: 'Description',  t: 'textarea' },
      { k: 'image',        l: 'Image path',   t: 'text' },
    ],
    empty: { name: '', brand: '', category: 'Laptops', price: 0, availability: 'In Stock', description: '', image: '' },
  },
];

function EditModal({ item, type, onSave, onClose, saving }) {
  const isNew = !item._id && !item.id;
  const [form, setForm] = useState({ ...item });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="adm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-modal__head">
          <span className="adm-modal__title">{isNew ? '➕ New' : '✏️ Edit'} {type.label.slice(0, -1)}</span>
          <button className="adm-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="adm-modal__body">
          {type.fields.map(f => (
            <div key={f.k} className="adm-form-group">
              <label className="adm-label" htmlFor={`field-${f.k}`}>{f.l}{f.req ? ' *' : ''}</label>
              {f.t === 'textarea' ? (
                <textarea id={`field-${f.k}`} className="adm-textarea" value={form[f.k] || ''} onChange={e => set(f.k, e.target.value)} rows={3} />
              ) : f.t === 'select' ? (
                <select id={`field-${f.k}`} className="adm-select" value={form[f.k] || ''} onChange={e => set(f.k, e.target.value)}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input id={`field-${f.k}`} className="adm-input" type={f.t} value={form[f.k] || ''} onChange={e => set(f.k, f.t === 'number' ? Number(e.target.value) : e.target.value)} />
              )}
            </div>
          ))}
        </div>
        <div className="adm-modal__foot">
          <button className="adm-btn adm-btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="adm-btn adm-btn--primary" onClick={() => onSave(form)} disabled={saving}>
            {saving ? <><span className="adm-spinner adm-spinner--sm" /> Saving…</> : isNew ? 'Create' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContentManager({ toast }) {
  const [activeType, setActiveType] = useState(TYPES[0]);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [fetched, setFetched] = useState({});
  const [search, setSearch]   = useState('');
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const fetchItems = useCallback(async type => {
    setLoading(true);
    try {
      const res = await fetch(`${API}${type.endpoint}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setFetched(f => ({ ...f, [type.key]: true }));
    } catch {
      toast('Could not load data from server.', 'error');
      setItems([]);
    }
    setLoading(false);
  }, [toast]);

  const switchType = type => {
    setActiveType(type);
    setSearch('');
    setItems([]);
    setFetched(f => ({ ...f, [type.key]: false }));
  };

  if (!fetched[activeType.key] && !loading) fetchItems(activeType);

  const saveItem = async form => {
    const isNew = !form._id && !form.id;
    setSaving(true);
    try {
      const url = `${API}${activeType.endpoint}${isNew ? '' : `/${form._id || form.id}`}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast(`✓ ${isNew ? 'Created' : 'Updated'} successfully!`, 'success');
        setEditing(null);
        fetchItems(activeType);
      } else {
        const e = await res.json().catch(() => ({}));
        toast(e.error || 'Save failed — check server connection.', 'error');
      }
    } catch { toast('Network error. Is the backend reachable?', 'error'); }
    setSaving(false);
  };

  const deleteItem = async item => {
    setConfirm(null);
    const id = item._id || item.id;
    try {
      const res = await fetch(`${API}${activeType.endpoint}/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) {
        setItems(it => it.filter(i => (i._id || i.id) !== id));
        toast('Deleted successfully.', 'success');
      } else { toast('Delete failed.', 'error'); }
    } catch { toast('Network error.', 'error'); }
  };

  const filtered = items.filter(i =>
    activeType.cols.some(c => String(i[c] || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="adm-panel">
      <div className="adm-panel__header">
        <h2 className="adm-panel__title">Content Manager</h2>
        <p className="adm-panel__sub">Add, edit, and delete services and products shown on the public website.</p>
      </div>

      {/* Type switcher */}
      <div className="adm-type-tabs">
        {TYPES.map(t => (
          <button
            key={t.key}
            className={`adm-type-tab${activeType.key === t.key ? ' active' : ''}`}
            onClick={() => switchType(t)}
          >
            {t.key === 'services' ? '⚙️' : '📦'} {t.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search">
          <span>🔍</span>
          <input
            placeholder={`Search ${activeType.label.toLowerCase()}…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="adm-search__clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
          <span className="adm-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => fetchItems(activeType)} disabled={loading}>
            {loading ? <span className="adm-spinner adm-spinner--sm" /> : '🔄'}
          </button>
          <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={() => setEditing(activeType.empty)}>
            ➕ Add
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="adm-center-loader"><div className="adm-spinner adm-spinner--lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty__icon">📋</div>
          <p>{search ? 'No items match your search.' : `No ${activeType.label.toLowerCase()} found.`}</p>
          {!search && <button className="adm-btn adm-btn--primary" style={{ marginTop: 12 }} onClick={() => setEditing(activeType.empty)}>Add your first {activeType.label.slice(0, -1)}</button>}
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                {activeType.cols.map(c => <th key={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</th>)}
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item._id || item.id || i}>
                  {activeType.cols.map(c => (
                    <td key={c}>
                      <span className="adm-table__cell">
                        {c === 'price' && item[c] ? `$${item[c]}` : (item[c] || '—')}
                      </span>
                    </td>
                  ))}
                  <td>
                    <div className="adm-table__actions">
                      <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => setEditing(item)} title="Edit">✏️</button>
                      <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => setConfirm(item)} title="Delete">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <EditModal item={editing} type={activeType} onSave={saveItem} onClose={() => setEditing(null)} saving={saving} />}
      {confirm && (
        <ConfirmModal
          title="Delete Item"
          msg={`Permanently delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={() => deleteItem(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
