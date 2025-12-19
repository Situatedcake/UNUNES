import React, { useContext, useState } from 'react';
import { AppContext } from '../context';

export const ProductModal = ({ product, onClose }) => {
  const { addToCart, user } = useContext(AppContext);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Пожалуйста, авторизуйтесь');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      alert('Ошибка добавления в корзину');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-55 right-161 text-gray-400 hover:text-gray-600 text-3xl transition font-bold z-10">
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div>
            <img src={product.image} alt={product.name} className="w-full rounded-xl shadow-lg" />
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-600 text-sm mb-2">Цена за единицу:</p>
                <p className="text-4xl font-bold text-blue-600">₽{product.price}</p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-3">Количество:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-10 h-10 rounded-lg font-bold transition"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="border-2 border-gray-300 rounded-lg px-4 py-2 w-16 text-center text-black font-bold focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-10 h-10 rounded-lg font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {added && (
                <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 font-bold">
                  ✓ Добавлено в корзину!
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="flex flex-nowrap items-center w-full bg-blue-600 text-white py-4 px-4 rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-lg hover:shadow-xl"
              >
                <img src="/cart.svg" className='h-8' />Добавить в корзину (₽{product.price * quantity})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
