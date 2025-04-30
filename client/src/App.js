import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL;

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/products`);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/products/${editingId}`, form);
    } else {
      await axios.post(`${API}/products`, form);
    }
    setForm({ name: '', description: '', price: '' });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/products/${id}`);
    fetchProducts();
  };

  return (
    <div className='p-6 max-w-xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Product Manager</h1>
      <form onSubmit={handleSubmit} className='mb-6'>
        <input
          className='border p-2 w-full mb-2'
          placeholder='Product Name'
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className='border p-2 w-full mb-2'
          placeholder='Product Description'
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className='border p-2 w-full mb-2'
          type='number'
          placeholder='Product Price'
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <button 
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>

      <ul>
        {products.map(p => (
          <li 
            key={p._id}
            className='border-b py-2 flex justify-between items-center'
          >
            <div>
              <p 
                className='font-bold'
              >
                {p.name} - ${p.price}
              </p>
              <p
                className='text-sm'
              >
                {p.description}
              </p>
            </div>
            <div>
              <button
                className='text-blue-500 mr-2'
                onClick={() => handleEdit(p)}
              >
                Edit
              </button>
              <button
                className='text-red-500 mr-2'
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

}

export default App;