import React, { useState, useEffect, useRef } from 'react';
import '../styles/Admin.css';

const API_URL = 'http://localhost:5000/api';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const initialForm = {
    name: '', brand: '', category: 'Laptops', 
    price: '', description: '', availability: 'In Stock', image: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, image: `http://localhost:5000${result.imageUrl}` }));
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialForm);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct._id}` 
        : `${API_URL}/products`;
        
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchProducts();
        closeModal();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  return (
    <div className="simple-admin">
      <div className="simple-admin__header">
        <h1>Product Management</h1>
        <button className="simple-btn" onClick={() => openModal()}>+ Add Product</button>
      </div>

      <table className="simple-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id || p.id}>
              <td>
                <img src={p.image?.startsWith('http') ? p.image : `http://localhost:5501${p.image}`} alt={p.name} />
              </td>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>${p.price}</td>
              <td>{p.availability}</td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="simple-btn" onClick={() => openModal(p)}>Edit</button>
                  {p._id && (
                    <button className="simple-btn simple-btn--danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="simple-modal-overlay">
          <div className="simple-modal">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="simple-form-group">
                <label>Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="simple-form-group">
                <label>Brand</label>
                <input required type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
              </div>
              <div className="simple-form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option>Laptops</option>
                  <option>Desktops</option>
                  <option>Printers</option>
                  <option>Desktop Accessories</option>
                  <option>Networking Equipment</option>
                </select>
              </div>
              <div className="simple-form-group">
                <label>Price ($)</label>
                <input required type="number" name="price" value={formData.price} onChange={handleInputChange} />
              </div>
              <div className="simple-form-group">
                <label>Availability</label>
                <select name="availability" value={formData.availability} onChange={handleInputChange}>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div className="simple-form-group">
                <label>Description</label>
                <textarea rows="3" name="description" value={formData.description} onChange={handleInputChange}></textarea>
              </div>
              
              <div className="simple-form-group">
                <label>Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} />
                {loading && <p>Uploading...</p>}
                {formData.image && (
                  <img src={formData.image?.startsWith('http') ? formData.image : `http://localhost:5501${formData.image}`} alt="Preview" className="image-preview" />
                )}
              </div>

              <div className="simple-modal-actions">
                <button type="button" className="simple-btn" style={{ background: '#94a3b8' }} onClick={closeModal}>Cancel</button>
                <button type="submit" className="simple-btn" disabled={loading}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
