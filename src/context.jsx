import React, { createContext, useState, useEffect } from 'react';
import { authAPI, cartAPI, productsAPI } from './api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Получаем товары
        const { data: productsData } = await productsAPI.getAll();
        setProducts(productsData || []);

        // Проверяем пользователя
        try {
          const { data: userData } = await authAPI.getUser();
          setUser(userData?.user || null);

          if (userData?.user) {
            const { data: cartData } = await cartAPI.getCart();
            setCart(cartData || []);
          }
        } catch (userError) {
          console.log('User check error (expected if not logged in):', userError.message);
          setUser(null);
        }
      } catch (error) {
        console.error('Init error:', error);
        alert('Ошибка подключения к серверу. Убедитесь, что сервер запущен на localhost:5000');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login(email, password);
      setUser(data.user);
      const { data: cartData } = await cartAPI.getCart();
      setCart(cartData || []);
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed';
      throw new Error(errorMsg);
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await authAPI.register(username, email, password);
      setUser(data.user);
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Registration failed';
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setCart([]);
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) throw new Error('Must be logged in');
    const { data } = await cartAPI.addToCart(productId, quantity);
    setCart(data);
  };

  const removeFromCart = async (productId) => {
    if (!user) throw new Error('Must be logged in');
    await cartAPI.removeFromCart(productId);
    setCart(cart.filter(item => item.productId !== productId));
  };

  const addProduct = async (product) => {
    const { data } = await productsAPI.create(product);
    setProducts([...products, data]);
    return data;
  };

  const updateProduct = async (id, product) => {
    const { data } = await productsAPI.update(id, product);
    setProducts(products.map(p => p.id === id ? data : p));
    return data;
  };

  const deleteProduct = async (id) => {
    await productsAPI.delete(id);
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user,
      products,
      cart,
      loading,
      login,
      register,
      logout,
      addToCart,
      removeFromCart,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </AppContext.Provider>
  );
};
