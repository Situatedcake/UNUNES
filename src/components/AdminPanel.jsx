import React, { useContext, useState } from 'react';
import { AppContext } from '../context';

export const AdminPanel = ({ onClose }) => {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(AppContext);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, {
          ...formData,
          price: parseInt(formData.price)
        });
      } else {
        await addProduct({
          ...formData,
          price: parseInt(formData.price)
        });
      }
      setFormData({ name: '', price: '', description: '', image: '', category: '' });
      setEditingId(null);
    } catch (error) {
      alert('Ошибка при сохранении товара');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      category: product.category
    });
    document.querySelector("#AdminPanel").scroll(0, 100);
  };

  const handleDelete = async (id) => {
    if (confirm('Вы уверены?')) {
      await deleteProduct(id);
    }
  };

  return (
    <div  className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div  id="AdminPanel" className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div  className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Админ панель</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-3xl transition font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="mb-8 p-6 border-2 border-gray-300 rounded-[10px] bg-gray-50 text-black">
            <h3 className="font-bold text-lg mb-6 text-gray-800">
              {editingId ? ' Редактировать товар' : 'Добавить новый товар'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Название</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Название товара"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Цена (₽)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="1000"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Описание</label>
              <textarea
                name="description"
                placeholder="Описание товара..."
                value={formData.description}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                rows="3"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">URL изображения</label>
                <input
                  type="text"
                  name="image"
                  placeholder="https://via.placeholder.com/..."
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Категория</label>
                <input
                  type="text"
                  name="category"
                  placeholder="Электроника"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-bold"
              >
                {editingId ? 'Обновить' : 'Добавить'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', price: '', description: '', image: '', category: '' });
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-bold"
                >
                  Отмена
                </button>
              )}
            </div>
          </form>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Товары ({products.length})
            </h3>
            
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Нет товаров</p>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex justify-between items-center border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{product.name}</p>
                      <p className="text-gray-600 text-sm">
                        ₽{product.price} • {product.category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition font-medium"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                      >
                         Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
