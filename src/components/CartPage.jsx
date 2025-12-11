import React, { useContext } from 'react';
import { AppContext } from '../context';

export const CartPage = ({ onClose }) => {
  const { cart, products, removeFromCart } = useContext(AppContext);

    const getProductDetails = (productId) => {
        return products.find(p => p.id === productId);  
    };

  const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const product = getProductDetails(item.productId);
            return total + (product?.price || 0) * item.quantity;
        }, 0);
  };

  return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800"> Корзина</h2>
                <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-gray-600 text-3xl transition font-bold"
                >
                    ✕
                </button>
                </div>

                <div className="p-6">
                {cart.length === 0 ? (
                    <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Ваша корзина пуста</p>
                    <button
                        onClick={onClose}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Вернуться к покупкам
                    </button>
                    </div>
                ) : (
                    <>
                    <div className="space-y-4 mb-8">
                        {cart.map((item) => {
                        const product = getProductDetails(item.productId);
                        return product ? (
                            <div key={item.productId} className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                                <p className="text-gray-500 text-sm">₽{product.price} × {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-lg text-blue-600">₽{product.price * item.quantity}</span>
                                <button
                                onClick={() => removeFromCart(item.productId)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                                >
                                Удалить
                                </button>
                            </div>
                            </div>
                        ) : null;
                        })}
                    </div>

                    <div className="border-t-2 border-gray-300 pt-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-700 font-medium">Товаров:</span>
                        <span className="text-gray-700">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-bold">
                        <span className="text-gray-800">Итого:</span>
                        <span className="text-green-600">₽{getTotalPrice()}</span>
                        </div>
                    </div>

                    <button className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition font-bold text-lg">
                        Оформить заказ
                    </button>
                    </>
                )}
                </div>
            </div>
        </div>
    );
};
