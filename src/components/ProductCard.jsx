import React, { useState } from 'react';

export const ProductCard = ({ product, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {!imageError ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-6xl">
            📦
          </div>
        )}
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          {product.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">₽{product.price}</span>
          <button
            onClick={() => onViewDetails(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-bold"
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
};
