import { useState, useContext, useEffect } from 'react';
import { Header } from './components/Header';
import { AuthPage } from './components/AuthPage';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartPage } from './components/CartPage';
import { AdminPanel } from './components/AdminPanel';
import { AppContext } from './context';

export default function App() {
  const { products, loading } = useContext(AppContext);
  
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, products]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header
        onAuthClick={() => setShowAuth(true)}
        onCartClick={() => setShowCart(true)}
        onAdminClick={() => setShowAdmin(true)}
        onSearch={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-white">
            <p className="text-2xl font-bold mb-4">Товары не найдены</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-white text-lg font-medium">
                Найдено товаров: <span className="text-blue-400 font-bold">{filteredProducts.length}</span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}
      {showCart && <CartPage onClose={() => setShowCart(false)} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}