import React, { useContext, useState } from 'react';
import { AppContext } from '../context';

export const AuthPage = ({ onClose }) => {
  const { login, register } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-50 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLogin ? 'Вход' : 'Регистрация'}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Имя пользователя</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Введите имя"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-black focus:border-blue-500 focus:outline-none transition"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-black focus:border-blue-500 focus:outline-none transition"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Пароль</label>
              <input
                type="password"
                name="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-black focus:border-blue-500 focus:outline-none transition"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 mt-6"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-300">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ username: '', email: '', password: '' });
              }}
              className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition"
            >
              {isLogin ? '↓ Создать новый аккаунт' : '↓ Уже есть аккаунт?'}
            </button>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-48 right-161 text-gray-400 hover:text-gray-600 text-2xl transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
